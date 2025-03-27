import { type NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Local } from "./lib/encore-client";
import { Home, AuthSignIn, AuthSignUp } from "./routes";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
}

export interface Session {
  user: User;
}

// Define route groups
const publicRoutes = [Home()];
const authRoutes = [AuthSignIn(), AuthSignUp()];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check main session authentication
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: Local,
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  ).catch(() => ({ data: null })); // Handle fetch errors gracefully

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // If user is signed in and tries to access auth routes, redirect to home
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(Home(), request.url));
  }

  // If user is not signed in and tries to access protected routes, redirect to sign-in
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL(AuthSignIn(), request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
