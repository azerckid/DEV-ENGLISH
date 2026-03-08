import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/my-vocabulary"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  // Auth redirect is handled in page.tsx (server component)
  return NextResponse.next();
}

export const config = {
  matcher: ["/my-vocabulary/:path*"],
};
