import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import UserModel from "../models/User.model";
import { type UserRequest } from "../types/user.types";
import { created, error, notfound, ok } from "../handlers/response.handler";
import { SECRET_TOKEN, KEY_MAIL } from "../config";
import { sendEmail } from "../utils/nodemailer";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

// [POST] create User
export const registerUser = async (
  { body }: Request<any, any, UserRequest>,
  res: Response
) => {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await UserModel.create({ ...body, password: hashedPassword });
    return created(res, user);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Hubo un error durante el registro." });
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
      longitud,
    } = req.body;
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return notfound(res, "User not found");
    }

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
    return ok(res, user);
  } catch (err) {
    console.error("Error updating user:", err);
    return error(res);
  }
};

//[GET] User Id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId, { password: 0 });

    if (!user) {
      return notfound(res, "User not found");
    }

    return ok(res, user);
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
      return notfound(res, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).header("Authorization", `Bearer ${token}`).json({
      message: "Successful login.",
      token: token,
      user,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return error(res);
  }
};

// [DELETE] Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return notfound(res, "User not found");
    }

    if (user.image && user.image.public_id) {
      await deleteImage(user.image.public_id);
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    return error(res);
  }
};

// [POST] Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return notfound(res, "User not found");
    }

    const token = jwt.sign({ id: user._id }, KEY_MAIL, {
      expiresIn: "1h",
    });

    sendEmail(user, token);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Error requesting password reset:", err);
    return error(res);
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
      return notfound(res, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Error resetting password:", err);
    return error(res);
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return notfound(res, "User not found");
    }

    if (!req.file) {
      return notfound(res, "No se proporciono imagen.");
    }

    // Sube la imagen a Cloudinary y obtén la URL y otros datos relevantes
    const result = await await uploadImage(req.file.path);

    const imageUrl = result.secure_url;
    const publicId = result.public_id;

    await fs.unlink(req.file.path);

    // Actualiza el campo 'image' del usuario en la base de datos con la URL de la imagen y otros datos relevantes
    await UserModel.findByIdAndUpdate(userId, {
      "image.secure_url": imageUrl,
      "image.public_id": publicId,
    });

    return res.status(200).json({ secure_url: imageUrl, public_id: publicId });
  } catch (err) {
    console.error("Error durante la subida de la imagen:", err);
    return error(res);
  }
};
