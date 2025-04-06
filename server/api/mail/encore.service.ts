import { Service } from "encore.dev/service";
import { secret } from "encore.dev/config";
import nodemailer from "nodemailer";
import log from "encore.dev/log";

export default new Service("Mail");

// Define secrets
const MAIL_HOST = secret("MAIL_HOST");
const MAIL_USERNAME = secret("MAIL_USERNAME");
const MAIL_PASSWORD = secret("MAIL_PASSWORD");
const MAIL_FROM = secret("MAIL_FROM");

const mailService = {
  sendMail: async ({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) => {
    // const transporter = nodemailer.createTransport({
    //   host: MAIL_HOST(),
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: MAIL_USERNAME(),
    //     pass: MAIL_PASSWORD(),
    //   },
    // });
    // const mailOptions = {
    //   from: MAIL_FROM(),
    //   to,
    //   subject,
    //   html,
    // };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "espositomario996@gmail.com",
        pass: "wbgn csbf xqjy pegy",
      },
    });
    const mailOptions = {
      from: "espositomario996@gmail.com",
      to,
      subject,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        log.error(`Error sending email: ${error.message}`);
      } else {
        log.error("An unknown error occurred while sending the email.");
      }
    }
  },
};

export const { sendMail } = mailService;
