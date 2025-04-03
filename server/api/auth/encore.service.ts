import { Service } from "encore.dev/service";
import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import pg from "pg";
import { sendMail } from "../mail/mail.service";
import { db } from "../../db/db";

export default new Service("User");

// Define all needed secrets within the service
const NODE_ENV = secret("NODE_ENV");
const DATABASE_URL = secret("DATABASE_URL");
const BETTER_AUTH_SECRET = secret("BETTER_AUTH_SECRET");
const BETTER_AUTH_URL = secret("BETTER_AUTH_URL");
const MAIL_HOST = secret("MAIL_HOST");
const MAIL_USERNAME = secret("MAIL_USERNAME");
const MAIL_PASSWORD = secret("MAIL_PASSWORD");
const MAIL_FROM = secret("MAIL_FROM");
const GOOGLE_CLIENT_ID = secret("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = secret("GOOGLE_CLIENT_SECRET");
const EMAIL_VERIFICATION_CALLBACK_URL = secret(
  "EMAIL_VERIFICATION_CALLBACK_URL",
);
const NEXT_PUBLIC_BETTER_AUTH_URL = secret("NEXT_PUBLIC_BETTER_AUTH_URL");

interface AuthParams {
  cookie: Header<"Cookie">;
}

interface AuthData {
  userID: string;
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
    if (!sessionToken) throw APIError.unauthenticated("No session token found");
    const alloggiatiToken = cookieMap["alloggiati_token"];
    const headers = new Headers();
    headers.append("Cookie", `better-auth.session_token=${sessionToken}`);
    headers.append("Cookie", `alloggiati_token=${alloggiatiToken}`);

    const session: Session | null = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw APIError.unauthenticated("Invalid session");
    }

    return { userID: session.user.id, alloggiatiToken: alloggiatiToken };
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
    "http://192.168.1.49:3000",
    "http://192.168.1.49:4000",
    "*",
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
  social: {
    providers: {
      google: {
        clientId: GOOGLE_CLIENT_ID(),
        clientSecret: GOOGLE_CLIENT_SECRET(),
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
