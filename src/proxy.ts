import { jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/profile", "/discover", "/projects/new"];
const AUTH_ONLY_PATHS = ["/login", "/register"];
const ADMIN_ONLY_PREFIXES = ["/admin"];

type Role = "user" | "admin";

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  let userRole: Role | null = null;
  if (token) {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      userRole = payload.role;
    } catch (err) {
      userRole = null;
      console.error(err);
    }
  }

  const redirectTo = (path: string, redirect?: string) => {
    const url = new URL(path, request.url);
    if (redirect) url.searchParams.set("redirect", redirect);
    return NextResponse.redirect(url);
  };

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !userRole) {
    return redirectTo("/login", pathname);
  }

  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) && userRole) {
    return redirectTo("/projects");
  }

  if (
    ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p)) &&
    userRole !== "admin"
  ) {
    return redirectTo("/projects");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
