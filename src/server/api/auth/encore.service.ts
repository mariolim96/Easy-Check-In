import { Service } from "encore.dev/service";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";
import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import pg from "pg";
import { UserDB } from "@/server/db/db";
import { sendMail } from "../mail/mail.service";

// Encore will consider this directory and all its subdirectories as part of the "api" service.
// https://encore.dev/docs/ts/primitives/services

export default new Service("User");

interface AuthParams {
  cookie: Header<"Cookie">;
}

interface AuthData {
  userID: string;
}

export const handler = authHandler<AuthParams, AuthData>(async (params) => {
  const cookieHeader = params.cookie;

  if (!cookieHeader) throw APIError.unauthenticated("Not authenticated");

  try {
    // Parse the cookie string to find the better-auth session token
    const cookieMap = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key.trim()] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const sessionToken = cookieMap["better-auth.session_token"];

    if (!sessionToken) throw APIError.unauthenticated("No session token found");

    // Create headers with the session cookie
    const headers = new Headers();
    headers.append("Cookie", `better-auth.session_token=${sessionToken}`);

    // Try to get the session using the cookie
    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session || !session.user || !session.user.id) {
      throw APIError.unauthenticated("Invalid session");
    }

    return {
      userID: session.user.id,
    };
  } catch (error) {
    throw APIError.unauthenticated("Invalid session");
  }
});

export const gateway = new Gateway({ authHandler: handler });

const { Pool } = pg;

export const auth: any = betterAuth({
  database: new Pool({ connectionString: UserDB.connectionString }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4000",
  ],
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        required: false,
        defaultValue: "user",
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Reset your password",
          html: `<p>Click the link to reset your password: ${url}</p>`,
        });
      },
    },
    //   emailVerification: {
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    //     sendVerificationEmail: async ({ user, token }) => {
    //       const verificationUrl = `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${env.EMAIL_VERIFICATION_CALLBACK_URL}`;
    //       await sendMail({
    //         to: user.email,
    //         subject: "Verify your email address",
    //         html: `<p>Click the link to verify your email: ${verificationUrl}</p>`,
    //       });
    //     },
    //   },
  },
  plugins: [admin()],
});

//   plugins: [openAPI(), admin(), nextCookies()], //nextCookies() should be last plugin in the list
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
//     cookieCache: {
//       enabled: true,
//       maxAge: 5 * 60, // Cache duration in seconds
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         default: "user",
//         required: false,
//         defaultValue: "user",
//       },
//     },
//     changeEmail: {
//       enabled: true,
//       sendChangeEmailVerification: async ({ newEmail, url }) => {
//         await sendMail({
//           to: newEmail,
//           subject: "Verify your email change",
//           html: `<p>Click the link to verify: ${url}</p>`,
//         });
//       },
//     },
//   },
//   socialProviders: {
//     github: {
//       clientId: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//     },
//   },

//   },
// });
