import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userVocabulary } from "@/lib/db-schema";
import { z } from "zod";
import { headers } from "next/headers";

const bodySchema = z.object({
  wordId: z.number().int().positive(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { wordId, source } = parsed.data;

  try {
    await db
      .insert(userVocabulary)
      .values({
        userId: session.user.id,
        wordId,
        source: source ?? "manual",
        addedAt: Math.floor(Date.now() / 1000),
      })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
