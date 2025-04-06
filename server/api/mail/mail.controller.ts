import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";
import { sendMail } from "./mail.service";

// Define secrets
const BETTER_AUTH_URL = secret("BETTER_AUTH_URL");

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export interface SendMailResponse {
  success: boolean;
  message: string;
}

export interface SendVerificationEmailParams {
  email: string;
  token: string;
  callbackURL: string;
}

export const sendMailEndpoint = api(
  {
    method: "POST",
    expose: true,
    // auth: true,
  },
  async (params: SendMailParams): Promise<SendMailResponse> => {
    // const auth = getAuthData();
    // if (!auth?.userID) {
    //   throw APIError.unauthenticated("User not authenticated");
    // }

    try {
      await sendMail(params);
      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      throw APIError.internal("Failed to send email", {
        cause: error instanceof Error ? error : undefined,
        name: "EmailError",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
);

export const sendVerificationEmail = api(
  {
    method: "POST",
    expose: true,
  },
  async (params: SendVerificationEmailParams): Promise<SendMailResponse> => {
    try {
      // Construct verification URL in the required format
      const verificationUrl = new URL(
        `${BETTER_AUTH_URL()}/api/auth/verify-email`,
      );
      verificationUrl.searchParams.append("token", params.token);
      verificationUrl.searchParams.append("callbackURL", params.callbackURL);

      await sendMail({
        to: params.email,
        subject: "Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Email Verification</h1>
            <p style="color: #666;">Please click the link below to verify your email address:</p>
            <a href="${verificationUrl.toString()}" 
               style="display: inline-block; 
                      padding: 10px 20px; 
                      background-color: #007bff; 
                      color: white; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      margin: 15px 0;">
              Verify Email
            </a>
            <p style="color: #666; font-size: 0.9em;">If you didn't request this verification, please ignore this email.</p>
            <p style="color: #666; font-size: 0.9em;">This link will expire in 24 hours.</p>
          </div>
        `,
      });

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      throw APIError.internal("Failed to send verification email", {
        cause: error instanceof Error ? error : undefined,
        name: "EmailVerificationError",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
);
