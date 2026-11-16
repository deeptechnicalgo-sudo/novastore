import { NextResponse } from "next/server";

export function middleware(request) {
  const allCookies = request.cookies.getAll();
  const isAuthenticated = allCookies.some((c) =>
    c.name === "user_session" ||
    c.name.startsWith("authjs") ||
    c.name.startsWith("__Secure-authjs") ||
    c.name.startsWith("next-auth") ||
    c.name.startsWith("__Secure-next-auth") ||
    c.name.startsWith("kinde") ||
    c.name === "id_token" ||
    c.name === "access_token"
  );

  if (!isAuthenticated) {
    const loginUrl = new URL("/sing", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Collections", "/Collections/:path*"],
};
