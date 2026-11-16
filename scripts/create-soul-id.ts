/**
 * Trains a Soul ID (v2) from the selfies in scripts/selfies/.
 *
 *   npm run soul-id                 # upload selfies, create reference, wait for training
 *   npm run soul-id -- --check <id> # resume waiting for an existing reference
 */
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createSoulId, getSoulId, uploadFile, type CustomReference } from "../lib/higgsfield";

const SELFIES_DIR = join(process.cwd(), "scripts", "selfies");
const POLL_MS = 30_000;
const MAX_WAIT_MS = 75 * 60_000;

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function referenceId(ref: CustomReference) {
  const id = ref.id ?? ref.reference_id ?? ref.custom_reference_id;
  if (typeof id !== "string") throw new Error(`No id in response: ${JSON.stringify(ref)}`);
  return id;
}

async function uploadSelfies() {
  const files = (await readdir(SELFIES_DIR).catch(() => [] as string[])).filter((f) => MIME[extname(f).toLowerCase()]).sort();
  if (files.length < 5 || files.length > 20) {
    throw new Error(`Put 5–20 selfies in scripts/selfies/ (found ${files.length}).`);
  }
  const urls: string[] = [];
  for (const [i, file] of files.entries()) {
    const data = await readFile(join(SELFIES_DIR, file));
    urls.push(await uploadFile(data, MIME[extname(file).toLowerCase()]));
    process.stdout.write(`\rUploaded ${i + 1}/${files.length}`);
  }
  process.stdout.write("\n");
  return urls;
}

async function waitForTraining(id: string) {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    const ref = await getSoulId(id);
    const status = String(ref.status ?? "unknown");
    const minutes = Math.round((Date.now() - started) / 60_000);
    process.stdout.write(`\r[${minutes} min] ${status.padEnd(14)}`);
    if (status === "completed" || status === "ready") {
      process.stdout.write("\n");
      return;
    }
    if (status === "failed") {
      process.stdout.write("\n");
      throw new Error(`Training failed: ${JSON.stringify(ref)}`);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`Still training after ${MAX_WAIT_MS / 60_000} min — resume with --check ${id}`);
}

async function main() {
  const checkIndex = process.argv.indexOf("--check");
  let id = checkIndex > -1 ? process.argv[checkIndex + 1] : undefined;

  if (!id) {
    const urls = await uploadSelfies();
    const ref = await createSoulId("kiim-avatar", urls);
    id = referenceId(ref);
    process.stdout.write(`Created reference ${id} — training usually takes 10–45 min.\n`);
  }

  await waitForTraining(id);
  process.stdout.write(`\nDone. Add this to .env.local:\n\nHF_SOUL_ID=${id}\n`);
}

main().catch((err) => {
  process.stderr.write(`\n${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
