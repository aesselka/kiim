import { NextResponse } from "next/server";
import { isConfigured, submitSoul } from "@/lib/higgsfield";
import { CUSTOM_MAX, OCCASIONS, looksFor } from "@/lib/occasions";
import { publicFileExists } from "@/lib/public-files";
import { canGenerate, recordRun } from "@/lib/rate-limit";
import { DEMO_FALLBACK } from "@/lib/site";
import type { GenerateResponse, Look, OccasionId, Selection } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseSelection(body: unknown): Selection | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.kind === "preset" && OCCASIONS.some((o) => o.id === b.id)) {
    return { kind: "preset", id: b.id as OccasionId };
  }
  if (b.kind === "custom" && typeof b.text === "string") {
    const text = b.text.trim();
    if (text.length >= 3 && text.length <= CUSTOM_MAX) return { kind: "custom", text };
  }
  return null;
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function demo(looks: Look[], reason: "limit" | "unavailable") {
  const body: GenerateResponse = {
    mode: "demo",
    reason,
    looks: looks.map((l) => ({
      lookId: l.id,
      imageUrl: l.demoImage && publicFileExists(l.demoImage) ? l.demoImage : DEMO_FALLBACK[l.mood],
    })),
  };
  return NextResponse.json(body);
}

export async function POST(req: Request) {
  const selection = parseSelection(await req.json().catch(() => null));
  if (!selection) {
    return NextResponse.json({ error: "Tell the stylist where you're going." }, { status: 400 });
  }

  const looks = looksFor(selection);
  if (!isConfigured()) return demo(looks, "unavailable");

  const ip = clientIp(req);
  if (!canGenerate(ip)) return demo(looks, "limit");

  try {
    const jobs = await Promise.all(
      looks.map(async (look) => ({
        lookId: look.id,
        requestId: await submitSoul({ prompt: look.prompt, enhancePrompt: selection.kind === "custom" }),
      })),
    );
    recordRun(ip);
    const body: GenerateResponse = { mode: "live", jobs };
    return NextResponse.json(body);
  } catch (err) {
    console.error("generate failed", err);
    return NextResponse.json({ error: "The studio is busy right now." }, { status: 502 });
  }
}
