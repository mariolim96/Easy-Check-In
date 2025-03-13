import { type NextRequest, NextResponse } from "next/server";

import { betterFetch } from "@better-fetch/fetch";

// import env from "./env";
// // import type { Session } from "./lib/auth";
// import { AuthSignIn, Home } from "./routes";
import authClient from "./lib/auth-client"; // Adjust the import path as necessary
import { Local } from "./lib/encore-client";
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
// const authRoutes = ["/sign-in", "/sign-up"];
// const passwordRoutes = ["/reset-password", "/forgot-password"];
// const adminRoutes = ["/admin"];
// const publicRoutes = [Home()];
export default async function authMiddleware(request: NextRequest) {
//   const session = await authClient.getSession();
  
  
//   console.log(' session:', session);


  //   // Allow public access to the root path
  //   if (publicRoutes.includes(pathName)) {
  //     return NextResponse.next();
  //   }

  //   const isAuthRoute = authRoutes.includes(pathName);
  //   const isPasswordRoute = passwordRoutes.includes(pathName);
  //   const isAdminRoute = adminRoutes.includes(pathName);

  //   // Fetch the session to check authentication and role
//   debugger;
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: Local,
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  //   // If no session exists and the route is not an auth or password route, redirect to sign-in
  //   if (!session) {
  //     if (isAuthRoute || isPasswordRoute) {
  //       return NextResponse.next();
  //     }
  //     return NextResponse.redirect(new URL(AuthSignIn(), request.url));
  //   }

  //   // If the user is authenticated but tries to access an auth or password route, redirect to home
  //   if (isAuthRoute || isPasswordRoute) {
  //     return NextResponse.redirect(new URL(Home(), request.url));
  //   }

  //   // Restrict access to admin routes based on user role
  //   if (isAdminRoute && session.user.role !== "admin") {
  //     return NextResponse.redirect(new URL(Home(), request.url));
  //   }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
