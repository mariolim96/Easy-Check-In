import { createAuthClient } from "better-auth/react";
import { Local } from "./encore-client";

const client = createAuthClient({
  baseURL: Local, // localhost:4000
});
export const {
  signIn,
  signUp,
  useSession,
  signOut,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} = client;

export default client;
