/**
 * Renders the avatar and lookbook photos with the trained Soul ID and saves
 * every candidate to scripts/out/ so the best ones can be hand-picked.
 *
 *   npm run render -- base                    # neutral avatar for the studio stage
 *   npm run render -- date-classic party-bold # specific looks
 *   npm run render -- all                     # every preset look
 *   add --batch 4 for four candidates per prompt (default: 4 for base, 1 for looks)
 *
 * Then copy the winners to public/avatar/base.jpg and public/lookbook/<look-id>.jpg.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getRequest, submitSoul } from "../lib/higgsfield";
import { OCCASIONS } from "../lib/occasions";

const OUT_DIR = join(process.cwd(), "scripts", "out");
const POLL_MS = 5000;
const MAX_WAIT_MS = 10 * 60_000;

const BASE_PROMPT =
  "full-body fashion photo of a young woman standing straight and facing the camera, arms relaxed, wearing a plain fitted black t-shirt, straight black trousers and minimal black shoes, in a dark seamless studio, warm orange rim light from behind, 35mm film look, natural skin texture, soft film grain";

const LOOKS = new Map(OCCASIONS.flatMap((o) => o.looks).map((l) => [l.id, l.prompt]));

function parseArgs() {
  const args = process.argv.slice(2);
  const batchIndex = args.indexOf("--batch");
  const batch = batchIndex > -1 ? Number(args.splice(batchIndex, 2)[1]) : undefined;
  const names = args.includes("all") ? [...LOOKS.keys()] : args;
  if (names.length === 0) throw new Error("Usage: npm run render -- base | all | <look-id>...");
  return { names, batch };
}

async function render(name: string, prompt: string, batchSize: 1 | 4) {
  const requestId = await submitSoul({ prompt, batchSize });
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    const r = await getRequest(requestId);
    if (r.status === "completed") {
      const files: string[] = [];
      for (const [i, url] of r.imageUrls.entries()) {
        const res = await fetch(url);
        const file = join(OUT_DIR, `${name}-${i + 1}.jpg`);
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
        files.push(file);
      }
      return `✓ ${name}: ${files.length} image(s)`;
    }
    if (r.status === "failed" || r.status === "nsfw") return `✗ ${name}: ${r.status}${r.error ? ` (${r.error})` : ""}`;
  }
  return `✗ ${name}: timed out (request ${requestId})`;
}

async function main() {
  const { names, batch } = parseArgs();
  await mkdir(OUT_DIR, { recursive: true });

  const jobs = names.map((name) => {
    const prompt = name === "base" ? BASE_PROMPT : LOOKS.get(name);
    if (!prompt) return Promise.resolve(`✗ ${name}: unknown look id`);
    const size: 1 | 4 = (batch ?? (name === "base" ? 4 : 1)) >= 4 ? 4 : 1;
    return render(name, prompt, size).catch((err: Error) => `✗ ${name}: ${err.message}`);
  });

  process.stdout.write(`Rendering ${names.length} prompt(s)…\n`);
  for (const line of await Promise.all(jobs)) process.stdout.write(`${line}\n`);
  process.stdout.write(`\nCandidates saved to scripts/out/\n`);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
