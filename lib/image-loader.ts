import type { ImageLoader } from "next/image";

/** Remote (Higgsfield) images go through /api/image; local ones use the default optimizer. */
export const remoteLoader: ImageLoader = ({ src, width }) =>
  `/api/image?url=${encodeURIComponent(src)}&w=${width}`;

export function loaderFor(src: string) {
  return src.startsWith("http") ? remoteLoader : undefined;
}
