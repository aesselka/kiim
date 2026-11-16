import { getImageProps } from "next/image";
import { remoteLoader } from "./image-loader";
import { looksFor } from "./occasions";
import type { GenerateResponse, RenderedLook, Selection, StatusResponse } from "./types";

const POLL_MS = 2500;
const TIMEOUT_MS = 6 * 60_000;
const DEMO_MIN_MS = 2800;
const PRELOAD_MAX_MS = 15_000;

/** One `sizes` for the stage and the look panels, so both hit the same optimized file. */
export const LOOK_IMAGE_SIZES = "(min-width: 1024px) 40vw, 90vw";

/** Warm the optimized images while the scan animation is still running. */
function preload(urls: string[], signal: AbortSignal) {
  const loads = urls.map(
    (src) =>
      new Promise<void>((resolve) => {
        const { props } = getImageProps({ src, alt: "", fill: true, sizes: LOOK_IMAGE_SIZES, loader: remoteLoader });
        const img = new window.Image();
        img.onload = img.onerror = () => resolve();
        img.sizes = props.sizes ?? LOOK_IMAGE_SIZES;
        if (props.srcSet) img.srcset = props.srcSet;
        img.src = props.src;
      }),
  );
  return Promise.race([Promise.all(loads), sleep(PRELOAD_MAX_MS, signal)]);
}

export type DemoReason = "limit" | "unavailable";

export type StyleResult = { looks: RenderedLook[]; demo?: DemoReason };

export class StylistError extends Error {}

const MESSAGES = {
  busy: "The studio hit a snag while dressing you. Give it another go in a moment.",
  moderated: "The studio couldn't render these looks. Try a different occasion or other words.",
  slow: "The studio is taking longer than usual. Give it another go in a moment.",
};

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

async function json<T>(res: Response): Promise<T | null> {
  return (await res.json().catch(() => null)) as T | null;
}

export async function styleMe(selection: Selection, signal: AbortSignal): Promise<StyleResult> {
  const looks = looksFor(selection);

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selection),
    signal,
  });
  const data = await json<GenerateResponse & { error?: string }>(res);
  if (!res.ok || !data) throw new StylistError(MESSAGES.busy);

  if (data.mode === "demo") {
    await sleep(DEMO_MIN_MS, signal);
    const images = new Map(data.looks.map((l) => [l.lookId, l.imageUrl]));
    return { looks: looks.map((l) => ({ ...l, imageUrl: images.get(l.id) })), demo: data.reason };
  }

  const lookByRequest = new Map(data.jobs.map((j) => [j.requestId, j.lookId]));
  const images = new Map<string, string>();
  let moderated = 0;
  const deadline = Date.now() + TIMEOUT_MS;

  while (lookByRequest.size > 0 && Date.now() < deadline) {
    await sleep(POLL_MS, signal);
    const ids = [...lookByRequest.keys()].join(",");
    const statusRes = await fetch(`/api/status?ids=${ids}`, { signal });
    const status = statusRes.ok ? await json<StatusResponse>(statusRes) : null;
    for (const job of status?.jobs ?? []) {
      const lookId = lookByRequest.get(job.requestId);
      if (!lookId) continue;
      if (job.status === "completed" && job.imageUrl) images.set(lookId, job.imageUrl);
      if (job.status === "nsfw") moderated += 1;
      if (job.status === "completed" || job.status === "failed" || job.status === "nsfw") {
        lookByRequest.delete(job.requestId);
      }
    }
  }

  if (images.size === 0) {
    throw new StylistError(moderated > 0 ? MESSAGES.moderated : lookByRequest.size > 0 ? MESSAGES.slow : MESSAGES.busy);
  }

  await preload([...images.values()], signal);
  return { looks: looks.map((l) => ({ ...l, imageUrl: images.get(l.id) })) };
}

export async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}
