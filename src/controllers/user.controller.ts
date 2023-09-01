import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { type Request, type Response } from "express";
import UserModel from "../models/User.model";
import { created, error } from "../handlers/response.handler";
import { SECRET_TOKEN, KEY_MAIL, MY_EMAIL, MY_PASSWORD } from "../config";

// [POST] create User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      localization,
      phone,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      localization,
      phone,
    });

    await newUser.save();

    return created(res, newUser);
  } catch (err) {
    console.log(err);
    error(res);
  }
};

// [PUT] update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      localization: localization,
      phone,
    } = req.body;
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    user.localization = localization;
    user.phone = phone;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//[GET] User Id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return error(res);
  }
};

// [POST] Login USer
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userByEmail = await UserModel.findOne({ email: email });

    const userByUsername = await UserModel.findOne({ username: email });

    const user = userByEmail || userByUsername;

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).header("Authorization", `${token}`).json({
      message: "Successful login.",
      token: token,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// [DELETE] Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// [POST] Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = jwt.sign({ id: user._id }, KEY_MAIL, {
      expiresIn: "1h",
    });

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
            <td align="center" bgcolor="#00466a" style="padding: 40px 0;">
              <a href="#" style="font-size: 24px; color: #ffffff; text-decoration: none; font-weight: bold;">ThinderPet</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h1 style="font-size: 18px; color: #333333; margin-top: 0;">Hi ${user.firstName},</h1>
              <p style="font-size: 16px; color: #666666;">We received a request to reset your password for your WoofApp account.</p>
      <p style="font-size: 16px; color: #666666;">Click the following link to reset your password:</p>        
      <div align="center" style="background-color: #00466a; padding: 10px 20px; border-radius: 4px; margin-top: 20px;">
                
      <a href="http://your-app-url/reset-password/${user._id}/${token}" style="background-color: #00466a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
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

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: nodemailer.SentMessageInfo) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Email could not be sent." });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Password reset email sent." });
      }
    );
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// [POST] Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.params;
    const { password } = req.body;

    const decodedToken = jwt.verify(token, KEY_MAIL) as {
      id: string;
      exp: number;
    };

    const now = Date.now() / 1000;
    if (decodedToken.exp < now) {
      return res.status(400).json({ message: "Token has expired." });
    }

    const user = await UserModel.findById(userId, { _id: decodedToken.id });

    if (!user) {
      return res.status(404).json({ Status: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error." });
  }
};
