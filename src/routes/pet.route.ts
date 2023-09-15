import { Router } from "express";
import { body, param } from "express-validator";
import validate from "../handlers/request.handler";
import { auth } from "../helpers/token";
import PetModel from "../models/Pet.model";
import { BreedModel } from "../models/Breed&Specie.model";
import {
  createPet,
  deletePet,
  getPet,
  updatePet,
  getPets,
  getUserPets,
  uploadImages,
} from "../controllers/pet.controller";
import UserModel from "../models/User.model";
import { genderValidation, nameValidation } from "../helpers/PetValidator";
import { uploads } from "../utils/multer";

const router = Router();

router.post(
  "/",
  [
    auth,

    ...nameValidation(false),
    ...genderValidation(false),

    body("breedId")
      .exists()
      .withMessage("breedId is required")
      .custom(async (value) => {
        const breed = await BreedModel.findById(value);
        if (!breed) throw new Error("breedId doesn't exist");
        return false;
      }),

    body("description")
      .optional()
      .isString()
      .withMessage("despcrition only can be a string")
      .isLength({ min: 4 }),

    body("ownerId")
      .exists()
      .withMessage("ownerId is required")
      .custom(async (value) => {
        const user = await UserModel.findById(value);
        if (!user) throw new Error("ownerId doesn't exist");
        return false;
      }),

    body("age")
      .exists()
      .withMessage("age is required")
      .isNumeric()
      .withMessage("age require a numeric value"),

    validate,
  ],
  createPet
);

router.put(
  "/:petId",
  [
    auth,

    param("petId").custom(async (value) => {
      const pet = await PetModel.findById(value);
      if (!pet) throw new Error("petId invalid");
      return false;
    }),

    ...nameValidation(true),
    ...genderValidation(true),

    body("description")
      .optional()
      .isString()
      .withMessage("despcrition only can be a string")
      .isLength({ min: 4 }),

    body("breedId")
      .optional()
      .custom(async (value) => {
        const breed = await BreedModel.findById(value);
        if (!breed) throw new Error("breedId doesn't exist");
        return false;
      }),

    body("ownerId")
      .isEmpty().
      withMessage("userId can not be updated"),

    validate,
  ],
  updatePet
);

// [GET] Pet
router.get("/:petId", [auth, validate], getPet);

//[GET] Pet from a ownderId
router.get("/petsfromowner/:ownerId", [auth, validate], getUserPets)

//[GET] Pets sorted only by localization
router.get("/thinder/:petId", [auth, validate], getPets)

// [DELETE] Pet
router.delete("/:petId", [auth, validate], deletePet);

router.post(
  "/upload-pet/:petId",
  [auth, validate, uploads.array("avatar")],
  uploadImages
);

export { router };
