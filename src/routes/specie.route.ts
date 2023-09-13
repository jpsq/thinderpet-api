import { Router } from "express";
import { auth } from "../helpers/token";
import { body } from "express-validator";
import { SpecieModel } from "../models/Breed&Specie.model";
import validate from "../handlers/request.handler";
import { createSpecie, getSpecies, deleteSpecies } from "../controllers/specie.controller";

const router = Router();

router.post(
    "/",
    [
        auth,

        body("specie")
            .exists()
            .withMessage("specie is required")
            .isLength({ min: 2 })
            .withMessage("specie minimun 2 characters")
            .custom(async (value) => {
                const specie = await SpecieModel.findOne({ specie: value });
                if (specie) throw new Error("specie already exist");
                return false;
            }),
        validate
    ],
    createSpecie
);

router.get("/", [auth, validate], getSpecies);


router.delete("/:specieId", [auth, validate], deleteSpecies);


export { router }