import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_ACCOUNT_PATHS = [
  "/account/login",
  "/account/signup",
  "/account/forgot-password",
  "/account/reset-password",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminLogin = pathname === "/admin/login";
  const isProtectedAccountPath =
    pathname.startsWith("/account") && !PUBLIC_ACCOUNT_PATHS.includes(pathname);
  const isProtectedAdminPath = pathname.startsWith("/admin") && !isAdminLogin;

  if (isProtectedAdminPath) {
    if (!isLoggedIn) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  if (isProtectedAccountPath && !isLoggedIn) {
    const url = new URL("/account/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
