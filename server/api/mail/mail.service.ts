import nodemailer from "nodemailer";
import winston from "winston";
// import {
//   NODE_ENV,
//   MAIL_HOST,
//   MAIL_USERNAME,
//   MAIL_PASSWORD,
//   MAIL_FROM,
// } from "../../config";

// Create logger
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// if (NODE_ENV() !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     }),
//   );
// }

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
    logger.info(`Sending mail to - ${to}`);
    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error sending email: ${error.message}`);
      } else {
        logger.error("An unknown error occurred while sending the email.");
      }
    }
  },
};

export const { sendMail } = mailService;
