import { type NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Local } from "./lib/encore-client";
import {
  AuthalloggiatiLogin,
  Properties,
  Home,
  AuthSignIn,
  AuthSignUp,
  AuthEmailVerified,
} from "./routes";

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
const authRoutes = [
  AuthSignIn(),
  AuthSignUp(),
  //   AuthEmailVerified(),
];

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
  );

  // If on auth route and already signed in, redirect to home
  if (authRoutes.some((route) => pathname === route) && session) {
    return NextResponse.redirect(new URL(Home(), request.url));
  }

  // Allow access to auth routes if not signed in
  if (authRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // If no session exists, redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL(AuthSignIn(), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
