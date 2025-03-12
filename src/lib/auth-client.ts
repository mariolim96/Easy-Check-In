import { createAuthClient } from "better-auth/react";
import { Local } from "./encore-client";
import env from "@/env";

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  forgetPassword,
  resetPassword,
} = createAuthClient({
  baseURL: Local,
});
