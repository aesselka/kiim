import type { JobStatus } from "./types";

/**
 * Server-side Higgsfield client. Never import this from a client component:
 * it reads the API secret from the environment.
 */

const BASE_URL = "https://api.higgsfield.ai";
const SOUL_V2 = "/higgsfield-ai/soul/v2/standard";

export class HiggsfieldError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HiggsfieldError";
  }
}

/** Accepts either the single console key (HF_API_KEY) or a separate id + secret pair. */
function apiKey() {
  const single = process.env.HF_API_KEY?.trim();
  if (single) return single;
  const id = process.env.HF_API_KEY_ID?.trim();
  const secret = process.env.HF_API_KEY_SECRET?.trim();
  return id && secret ? `${id}:${secret}` : null;
}

function credentials() {
  const key = apiKey();
  if (!key) throw new HiggsfieldError("Higgsfield credentials are not configured", 500);
  return `Key ${key}`;
}

/** Live generation from the site is opt-in: without HF_LIVE=1 the studio stays in demo mode. */
export function isConfigured() {
  return process.env.HF_LIVE === "1" && Boolean(apiKey() && process.env.HF_SOUL_ID);
}

async function hf<T>(path: string, init: RequestInit & { idempotencyKey?: string } = {}, retries = 1): Promise<T> {
  const { idempotencyKey, ...rest } = init;
  const headers: Record<string, string> = {
    Authorization: credentials(),
    Accept: "application/json",
  };
  if (rest.body) headers["Content-Type"] = "application/json";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers, cache: "no-store" });

  if (res.status === 429 && retries > 0) {
    const wait = Math.min(Number(res.headers.get("retry-after")) || 2, 6);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return hf<T>(path, init, retries - 1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new HiggsfieldError(`Higgsfield ${res.status} on ${path}: ${text.slice(0, 300)}`, res.status);
  }

  return (await res.json()) as T;
}

/* ---- Generation ---- */

type SubmitResponse = { request_id: string; status: string; status_url?: string };

type RequestStatus = {
  request_id: string;
  status: JobStatus | "canceled";
  images?: { url: string }[];
  error?: string | null;
};

export type SoulOptions = {
  prompt: string;
  enhancePrompt?: boolean;
  batchSize?: 1 | 4;
  seed?: number;
  idempotencyKey?: string;
};

export async function submitSoul({ prompt, enhancePrompt = false, batchSize = 1, seed, idempotencyKey }: SoulOptions) {
  const soulId = process.env.HF_SOUL_ID;
  if (!soulId) throw new HiggsfieldError("HF_SOUL_ID is not configured", 500);

  const body = {
    prompt,
    custom_reference_id: soulId,
    custom_reference_strength: 1,
    aspect_ratio: "3:4",
    resolution: "1080p",
    batch_size: batchSize,
    enhance_prompt: enhancePrompt,
    ...(seed ? { seed } : {}),
  };

  const res = await hf<SubmitResponse>(SOUL_V2, {
    method: "POST",
    body: JSON.stringify(body),
    idempotencyKey: idempotencyKey ?? crypto.randomUUID(),
  });
  return res.request_id;
}

export async function getRequest(requestId: string) {
  const res = await hf<RequestStatus>(`/requests/${encodeURIComponent(requestId)}/status`);
  const status: JobStatus = res.status === "canceled" ? "failed" : res.status;
  return {
    requestId: res.request_id ?? requestId,
    status,
    imageUrls: (res.images ?? []).map((i) => i.url),
    error: res.error ?? undefined,
  };
}

/* ---- Files & Soul ID (used by local scripts) ---- */

type UploadUrl = {
  public_url: string;
  upload_url: string;
  upload_headers?: Record<string, string>;
};

export async function uploadFile(data: Uint8Array, contentType: string) {
  const target = await hf<UploadUrl>("/files/generate-upload-url", {
    method: "POST",
    body: JSON.stringify({ content_type: contentType }),
  });
  const put = await fetch(target.upload_url, {
    method: "PUT",
    headers: target.upload_headers ?? { "Content-Type": contentType },
    body: Buffer.from(data),
  });
  if (!put.ok) throw new HiggsfieldError(`Upload failed with ${put.status}`, put.status);
  return target.public_url;
}

export type CustomReference = { id: string; status?: string; [key: string]: unknown };

export async function createSoulId(name: string, imageUrls: string[]) {
  return hf<CustomReference>("/v1/custom-references", {
    method: "POST",
    body: JSON.stringify({
      name,
      model_version: "v2",
      input_images: imageUrls.map((image_url) => ({ type: "image_url", image_url })),
    }),
  });
}

export async function getSoulId(id: string) {
  return hf<CustomReference>(`/v1/custom-references/${encodeURIComponent(id)}`);
}
