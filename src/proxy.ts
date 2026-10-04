import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/pantry", "/plan", "/eateries"];

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("mlopika-session");
  const isProtected = PROTECTED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pantry/:path*", "/plan/:path*", "/eateries/:path*"],
};