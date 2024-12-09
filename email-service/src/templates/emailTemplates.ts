export const generateOtpEmailTemplate = (otp: string): string => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Your Verification Code</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Use the code below to verify your email address:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; color: #4CAF50; font-weight: bold; padding: 10px 20px; border: 1px dashed #4CAF50; border-radius: 5px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #555; text-align: center;">
          This code is valid for 3 minutes. If you did not request this code, please ignore this email.
        </p>
        <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          <p>Thank you for using our service.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </footer>
      </div>
    `;
  };
  