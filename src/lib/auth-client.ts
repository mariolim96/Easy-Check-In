import { createAuthClient } from "better-auth/react";
import { Local } from "./encore-client";

const client = createAuthClient({
  baseURL: Local,
});
export const {
  signIn,
  signUp,
  useSession,
  signOut,
  forgetPassword,
  resetPassword,
} = client;

export default client;
