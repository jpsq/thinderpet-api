import express from "express";
import {
  validateRegisterUser,
  validateUpdatePasswordUser,
  validateUpdateUser,
} from "../helpers/UserValidator";
import {
  deleteUser,
  loginUser,
  registerUser,
  resetPassword,
  requestPasswordReset,
  updateUser,
  getUserById,
} from "../controllers/user.controller";
import { auth } from "../helpers/token";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", validateRegisterUser, registerUser);
router.get("/:userId", [auth], getUserById);
router.put("/update/:userId", [auth], validateUpdateUser, updateUser);
router.delete("/delete/:userId", [auth], deleteUser);
router.post("/forgot-password", requestPasswordReset);
router.post(
  "/reset-password/:userId/:token",
  validateUpdatePasswordUser,
  resetPassword
);

export { router };
