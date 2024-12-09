import { transporter } from "../config/nodemailerConfig";
import { logInfo, logError } from "../utils/loggerHelper";

/**
 * Sends an email using Nodemailer with HTML content.
 * @param to - Recipient's email address.
 * @param subject - Subject of the email.
 * @param html - HTML content of the email.
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logInfo("Email Sent Successfully", { to, subject, response: info.response });
  } catch (error: any) {
    logError(`Error Sending Email to ${to}`, error, { subject });
    throw error;
  }
};
