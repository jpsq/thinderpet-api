import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import UserModel from "../models/User.model";
import { created, error } from "../handlers/response.handler";
import { SECRET_TOKEN, KEY_MAIL } from "../config";
import { sendEmail } from "../utils/nodemailer";

// [POST] create User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { //estoy hay que cambiarlo a el formato ...body
      firstName,
      lastName,
      email,
      username,
      password,
      localization,
      phone,
      latitud,
      longitud
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
      latitud,
      longitud,
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
      latitud,
      longitud
    } = req.body;
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //es posible solo pasarle el body
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    user.localization = localization;
    user.phone = phone;
    user.latitud = latitud;
    user.longitud = longitud;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    return error(res)
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

    sendEmail(user, token);

    res.status(200).json({ message: "Password reset email sent." });
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
