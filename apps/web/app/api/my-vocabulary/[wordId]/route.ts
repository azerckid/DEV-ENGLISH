import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userVocabulary } from "@/lib/db-schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ wordId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { wordId: wordIdStr } = await params;
  const wordId = parseInt(wordIdStr, 10);
  if (isNaN(wordId)) {
    return NextResponse.json({ error: "Invalid wordId" }, { status: 400 });
  }

  await db
    .delete(userVocabulary)
    .where(
      and(
        eq(userVocabulary.userId, session.user.id),
        eq(userVocabulary.wordId, wordId)
      )
    );

  return NextResponse.json({ ok: true });
}
