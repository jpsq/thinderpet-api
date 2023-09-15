import { Router } from "express";
import { param, body } from "express-validator";
import { auth } from "../helpers/token";
import { BreedModel, SpecieModel } from "../models/Breed&Specie.model";
import { createBreed, getBreeds, deleteBreeds } from "../controllers/breed.controller";
import validate from "../handlers/request.handler";
import { nameregex } from "../helpers/PetValidator";

const router = Router()

router.post(
    "/",
    [
        auth,

        body("specieId")
            .exists()
            .withMessage("specieId is required")
            .isLength({ min: 2 })
            .withMessage("specieId minimun 3 characters")
            .custom(async (value) => {
                try {
                    const specieId = await SpecieModel.findById(value);
                    if (!specieId) throw new Error("specieId doesn't exist");
                } catch (e) {
                    throw new Error("Oops! Something wrong");
                }
                return false;
            }),

        body("breed")
            .exists()
            .withMessage("breed is required")
            .isLength({ min: 2 })
            .withMessage("breed minimun 2 characters")
            .custom(async (value) => {
                const breed = await BreedModel.findOne({ breed: value });
                if (breed) throw new Error("breed already exist");
                return false;
            })
            .matches(nameregex)
            .withMessage("name can only contain letters and spaces"),

        validate
    ],
    createBreed
);

router.get("/:specieId",
    [
        auth,

        param("specieId").custom(async (value) => {
            const specie = await SpecieModel.findById(value);
            if (!specie) {
                throw new Error("Specie not found");
            }
            return true;
        }),

        validate
    ],
    getBreeds)

router.delete("/:breedId", [auth, validate], deleteBreeds);


export { router }
