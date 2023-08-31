import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import UserModel from "../models/User.model";
import { created, error } from "../handlers/response.handler";
import { SECRET_TOKEN } from "../config";

// [POST] create User
export const registerUser = async (req: Request, res: Response) => {

  try {
    const { firstName, lastName, email, password, localization, phone } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      localization,
      phone,
    });

    await newUser.save();

    return created(res, newUser)
  } catch (err) {
    console.log(err);
    error(res);
  }

};

// [PUT] update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, localization: localization, phone } =
      req.body;
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
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

// [POST] Login USer
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).header("Authorization", `Bearer token: ${token}`).json({
      message: "Successful login.",
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
};
