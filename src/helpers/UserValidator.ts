import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import UserModel from "../models/User.model";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegisterUser = [
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (value) => {
      const userWithEmail = await UserModel.findOne({ email: value });
      if (userWithEmail) {
        throw new Error("Email already exists.");
      }
    }),
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .custom(async (value) => {
      const userWithUsername = await UserModel.findOne({ username: value });
      if (userWithUsername) {
        throw new Error("Username already exists.");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one digit, and one special character."
    ),
  body("localization").notEmpty().withMessage("Localization is required."),
  body("phone").notEmpty().withMessage("Phone number is required."),

  handleValidationErrors,
];

export const validateUpdateUser = [
  param("userId").notEmpty().withMessage("User ID is required."),
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (value) => {
      const userWithEmail = await UserModel.findOne({ email: value });
      if (userWithEmail) {
        throw new Error("Email already exists.");
      }
    }),
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .custom(async (value) => {
      const userWithUsername = await UserModel.findOne({ username: value });
      if (userWithUsername) {
        throw new Error("Username already exists.");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one digit, and one special character."
    ),
  body("localization").notEmpty().withMessage("Localization is required."),
  body("phone").notEmpty().withMessage("Phone number is required."),

  handleValidationErrors,
];

export const validateUpdatePasswordUser = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one digit, and one special character."
    ),

  handleValidationErrors,
];
