import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  sourceUrl: z.string().url(),
  rawText: z.string().min(10).max(10000),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // TODO: persist to a contributions table or send to a queue for review
  // For now, log and acknowledge
  console.log("[contribute]", parsed.data.sourceUrl, parsed.data.rawText.slice(0, 100));

  return NextResponse.json({ ok: true });
}
