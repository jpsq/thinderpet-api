import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import User from "../models/User.model";
import type { User as UserType } from "../types/user.types";
import { SECRET_TOKEN } from "../config";

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token missing" });
    }

    const decodedToken: any = jwt.verify(token, SECRET_TOKEN);

    const user = await User.findOne({ _id: decodedToken.id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User of token not found" });
    }

    req.user = user;
    next();

  } catch (err: any) {

    console.error("Error authenticating token:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized. Token expired." })
    } else {
      return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }
  }
};
