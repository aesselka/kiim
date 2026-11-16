import { existsSync } from "node:fs";
import { join } from "node:path";

/** Server-only: whether a file under /public exists (e.g. a rendered lookbook photo). */
export function publicFileExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath));
}
