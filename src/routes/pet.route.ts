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
    updatePet
} from "../controllers/pet.controller";
import UserModel from "../models/User.model";
import {
    genderValidation,
    nameValidation
} from "../helpers/PetValidator";

const router = Router();

router.post(
    "/",
    [
        ...nameValidation(false),
        ...genderValidation(false),

        body("breedId")
            .exists()
            .withMessage("breedId is required")
            .isLength({ min: 16 })
            .withMessage("breedId minimun 16 characters")
            .custom(async (value) => {
                const breed = await BreedModel.findById(value);
                if (!breed) throw new Error("breedId doesn't exist");
                return false;
            }),

        body("ownerId")
            .exists()
            .withMessage("userId is required")
            .isLength({ min: 16 })
            .withMessage("userId minimun 16 characters")
            .custom(async (value) => {
                const user = await UserModel.findById(value);
                if (!user) throw new Error("userId doesn't exist");
                return false;
            }),

        validate
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

        body("breedId")
            .if(body("breedId").exists())
            .isLength({ min: 16 })
            .withMessage("breedId minimun 16 characters")
            .custom(async (value) => {
                const breed = await BreedModel.findById(value);
                if (!breed) throw new Error("breedId doesn't exist");
                return false;
            }),

        body("ownerId")
            .isEmpty()
            .withMessage("userId can not be updated"),

        validate
    ],
    updatePet
);

// [GET] Pet
router.get("/:petId", auth, getPet);

// [DELETE] Pet
router.delete("/:petId", [auth], deletePet);

export { router };
