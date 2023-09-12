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
  body("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isString()
    .withMessage("firstName must be a string")
    .isLength({ min: 3, max: 22 })
    .withMessage("first name min characters: 3, max characters: 22"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isString()
    .withMessage("lastname must be a string")
    .isLength({ min: 3, max: 22 })
    .withMessage("first name min characters: 3, max characters: 22"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
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
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one digit, and one special character."
    ),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("any") //buscar caracteristica de arg
    .withMessage("phone must be a phone number"),
  body("localization")
    .notEmpty()
    .withMessage("Localization is required.")
    .isLength({ min: 4 })
    .withMessage("localization mut be at least 4 characters.")
    .isString()
    .withMessage("Localization must be string"),
  body("latitud")
    .notEmpty()
    .withMessage("Latitud is required")
    .isNumeric()
    .withMessage("Latitud must be a number"),
  body("longitud")
    .notEmpty()
    .withMessage("Longitud is required")
    .isNumeric()
    .withMessage("Longitud must be a number"),

  handleValidationErrors,
];

export const validateUpdateUser = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required."),
  body("firstName")
    .optional()
    .isString()
    .withMessage("firstName must be a string")
    .isLength({ min: 3, max: 22 })
    .withMessage("first name min characters: 3, max characters: 22"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("lastName must be a string")
    .isLength({ min: 3, max: 22 })
    .withMessage("first name min characters: 3, max characters: 22"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (value) => {
      const userWithEmail = await UserModel.findOne({ email: value });
      if (userWithEmail) {
        throw new Error("Email already exists.");
      }
    }),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Username is required.")
    .custom(async (value) => {
      const userWithUsername = await UserModel.findOne({ username: value });
      if (userWithUsername) {
        throw new Error("Username already exists.");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one digit, and one special character."
    ),
  body("phone")
    .optional(),
  body("localization")
    .optional()
    .isLength({ min: 4 })
    .withMessage("localization mut be at least 4 characters.")
    .isString().withMessage("Localization must be string"),
  body("latitud")
    .optional()
    .isNumeric()
    .withMessage("Latitud must be a number"),
  body("longitud")
    .optional()
    .isNumeric()
    .withMessage("Longitud must be a number"),


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
