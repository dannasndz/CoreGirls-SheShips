import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/api/forum", "/api/quiz/submit", "/api/groups", "/api/events"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Allow GET on forum posts and groups without auth
  if (
    (pathname.startsWith("/api/forum") || pathname.startsWith("/api/groups") || pathname.startsWith("/api/events")) &&
    req.method === "GET"
  ) {
    return NextResponse.next();
  }

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/forum/:path*", "/api/quiz/submit", "/api/groups/:path*", "/api/events/:path*"],
};
