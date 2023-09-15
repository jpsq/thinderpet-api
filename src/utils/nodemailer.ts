import nodemailer from "nodemailer";
import { MY_EMAIL, MY_PASSWORD } from "../config";
import { type User } from "../types/user.types";

export const sendEmail = async (user: User, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MY_EMAIL,
      pass: MY_PASSWORD,
    },
    debug: true,
  });

  const mailOptions = {
    from: MY_EMAIL,
    to: user.email,
    subject: "Reset ThinderPet Password",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ThinderPet Email Template</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
    
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 40px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <tr>
          <td align="center" bgcolor="#e1828e" style="padding: 40px 0;">
            <a href="#" style="font-size: 24px; color: #ffffff; text-decoration: none; font-weight: bold;">ThinderPet</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h1 style="font-size: 18px; color: #333333; margin-top: 0;">Hi ${user.firstName},</h1>
            <p style="font-size: 16px; color: #666666;">We received a request to reset your password for your ThinderPet account.</p>
    <p style="font-size: 16px; color: #666666;">Click the following link to reset your password:</p>        
    <div align="center" style="background-color: #e1828e; padding: 10px 20px; border-radius: 4px; margin-top: 20px;">
              
    <a href="https://thinderpet.vercel.app/reset-password/${user._id}/${token}" style="background-color: #e1828e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </div>
            <p style="font-size: 16px; color: #666666; margin-top: 20px;">Regards,<br>Team ThinderPet</p>
          </td>
        </tr>
        <tr>
          <td bgcolor="#eeeeee" style="padding: 20px; text-align: center;">
            <p style="font-size: 14px; color: #999999;">© 2023 ThinderPet Inc. </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
        `,
  };

  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve();
      }
    });
  });
};
