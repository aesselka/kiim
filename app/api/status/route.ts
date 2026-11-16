import { NextResponse } from "next/server";
import { getRequest, isConfigured } from "@/lib/higgsfield";
import type { StatusResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").filter((id) => UUID.test(id));
  if (!isConfigured() || ids.length === 0 || ids.length > 3) {
    return NextResponse.json({ error: "Unknown request." }, { status: 400 });
  }

  const jobs = await Promise.all(
    ids.map(async (requestId) => {
      try {
        const r = await getRequest(requestId);
        return { requestId, status: r.status, imageUrl: r.imageUrls[0] };
      } catch (err) {
        console.error("status failed", requestId, err);
        return { requestId, status: "in_progress" as const };
      }
    }),
  );

  const body: StatusResponse = { jobs };
  return NextResponse.json(body);
}
