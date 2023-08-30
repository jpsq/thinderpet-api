import express from "express";
import {
  validateRegisterUser,
  validateUpdateUser,
} from "../helpers/UserValidator";
import {
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller";
import { auth } from "../helpers/token";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", validateRegisterUser, registerUser);
router.put("/:userId", [auth], validateUpdateUser, updateUser);

export { router };
