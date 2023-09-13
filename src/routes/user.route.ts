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
  uploadAvatar,
} from "../controllers/user.controller";
import { auth } from "../helpers/token";
import { uploads } from "../utils/multer";
import validate from "../handlers/request.handler";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", validateRegisterUser, registerUser);
router.get("/:userId", [auth, validate], getUserById);
router.put("/update/:userId", [auth, validate], validateUpdateUser, updateUser);
router.delete("/delete/:userId", [auth, validate], deleteUser);
router.post("/forgot-password", requestPasswordReset);
router.post(
  "/reset-password/:userId/:token",
  validateUpdatePasswordUser,
  resetPassword
);
router.post(
  "/upload-image/:userId",
  [auth, validate, uploads.single("avatar")],
  uploadAvatar
);

export { router };
