import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/infrastructure/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  const { pathname } = request.nextUrl;

  // API routes verify the Session themselves, behind the session seam
  // (see GLOSSARY.md). Middleware's redirects only ever apply to pages,
  // so don't validate the session twice.
  if (pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = pathname === "/login";
  const isRootPage = pathname === "/";
  const isOAuthCallback = pathname === "/auth/callback";
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/applications") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/resumes");

  if (isOAuthCallback) {
    return supabaseResponse;
  }

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (isAuthPage || isRootPage)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
