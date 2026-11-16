import sharp from "sharp";

export const runtime = "nodejs";

/**
 * Resizes Higgsfield outputs (~5 MB PNGs on CloudFront) into small WebPs.
 * Unlike the built-in optimizer it has no 7 s upstream timeout, and it
 * fetches each original once per instance however many sizes are asked for.
 */

const ALLOWED_HOST = /^[a-z0-9]+\.cloudfront\.net$/;
const MAX_WIDTH = 1600;
const CACHE_LIMIT = 24;

const originals = new Map<string, Promise<Buffer>>();

function fetchOriginal(url: string) {
  const cached = originals.get(url);
  if (cached) return cached;
  const pending = fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  });
  pending.catch(() => originals.delete(url));
  originals.set(url, pending);
  if (originals.size > CACHE_LIMIT) originals.delete(originals.keys().next().value!);
  return pending;
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const width = Math.min(Math.max(Number(params.get("w")) || 640, 16), MAX_WIDTH);

  let source: URL;
  try {
    source = new URL(params.get("url") ?? "");
  } catch {
    return new Response("Bad image url", { status: 400 });
  }
  if (source.protocol !== "https:" || !ALLOWED_HOST.test(source.hostname)) {
    return new Response("Image host not allowed", { status: 400 });
  }

  try {
    const original = await fetchOriginal(source.toString());
    const body = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 502 });
  }
}
