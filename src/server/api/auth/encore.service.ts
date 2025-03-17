import { Service } from "encore.dev/service";
import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import pg from "pg";
import { db } from "@/server/db/db";
import { sendMail } from "../mail/mail.service";

export default new Service("User");

interface AuthParams {
  cookie: Header<"Cookie">;
}

interface AuthData {
  userID: string;
  alloggiatiToken?: string;
}

interface SessionUser {
  id: string;
  email?: string;
}

interface Session {
  user?: SessionUser;
}

export const handler = authHandler<AuthParams, AuthData>(async (params) => {
  const cookieHeader = params.cookie;
  if (!cookieHeader) throw APIError.unauthenticated("Not authenticated");

  try {
    const cookieMap = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key.trim()] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const sessionToken = cookieMap["better-auth.session_token"];
    const alloggiatiToken = cookieMap["alloggiati_token"];

    if (!sessionToken) throw APIError.unauthenticated("No session token found");
    if (!alloggiatiToken)
      throw APIError.unauthenticated("No alloggiati token found");

    const headers = new Headers();
    headers.append("Cookie", `better-auth.session_token=${sessionToken}`);

    const session: Session | null = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw APIError.unauthenticated("Invalid session");
    }

    return {
      userID: session.user.id,
      alloggiatiToken,
    };
  } catch {
    throw APIError.unauthenticated("Invalid session");
  }
});

export const gateway = new Gateway({ authHandler: handler });

const { Pool } = pg;

export const auth = betterAuth({
  database: new Pool({ connectionString: db.connectionString }),
  emailAndPassword: { enabled: true },
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
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  user: {
    deleteUser: { enabled: true },
    additionalFields: {
      role: { type: "string", default: "user", required: false },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({
        user,
        url,
      }: {
        user: { email: string };
        url: string;
      }) => {
        if (user.email) {
          await sendMail({
            to: user.email,
            subject: "Reset your password",
            html: `<p>Click the link to reset your password: ${url}</p>`,
          });
        }
      },
    },
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
