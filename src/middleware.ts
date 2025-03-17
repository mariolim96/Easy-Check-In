import { type NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
// import env from "./env";
import { Local } from "./lib/encore-client";
import { AuthalloggiatiLogin, Properties, Home, AuthSignIn } from "./routes";

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
const authRoutes = [AuthSignIn()];
const alloggiatiProtectedRoutes = [Properties()];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  //   // Allow public access to the root path
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is logged into Alloggiati
  const alloggiatiToken = request.cookies.get("alloggiati_token")?.value;
  console.log(" alloggiatiToken:", alloggiatiToken);
  const alloggiatiUser = request.cookies.get("alloggiati_user")?.value;
  console.log(" alloggiatiUser:", alloggiatiUser);

  // If not logged into Alloggiati, redirect to login
  //   debugger;
  //   if (!alloggiatiToken || !alloggiatiUser) {
  //     return NextResponse.redirect(new URL(AuthalloggiatiLogin(), request.url));
  //   }
  // Allow auth routes
  if (authRoutes.some((route) => pathname === route)) {
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
  console.log("session:", session);
  // If no session exists, redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL(AuthSignIn(), request.url));
  }

  // For routes that require Alloggiati authentication
  if (alloggiatiProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const alloggiatiToken = request.cookies.get("alloggiati_token")?.value;

    // Check if Alloggiati token exists and is not expired
    if (!alloggiatiToken) {
      return NextResponse.redirect(new URL(AuthalloggiatiLogin(), request.url));
    }

    // Optionally: Check if token is expired
    const alloggiatiExpires = request.cookies.get("alloggiati_expires")?.value;
    if (alloggiatiExpires && new Date(alloggiatiExpires) < new Date()) {
      // Clear expired tokens
      const response = NextResponse.redirect(
        new URL(AuthalloggiatiLogin(), request.url),
      );
      response.cookies.delete("alloggiati_token");
      response.cookies.delete("alloggiati_expires");
      response.cookies.delete("alloggiati_user");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
