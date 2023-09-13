import { BreedModel, SpecieModel } from "../models/Breed&Specie.model";
import { badRequest, created, error, ok } from "../handlers/response.handler";
import { type Request, type Response } from "express";
import { type Specie } from "../types/breed&specie.types";

export const createSpecie = async ({ body }: Request, res: Response) => {
    try {
        const specie = await SpecieModel.create(body);
        return created(res, specie);
    } catch (e) {
        console.log(e);
        return error(res);
    }
};

export const getSpecies = async (req: Request, res: Response) => {
    try {
        const species = await SpecieModel.find();
        if (species.length === 0)
            return badRequest(res, "There aren't species created");
        return ok(res, species);
    } catch (e) {
        console.log(e);
        return error(res);
    }
};

export const deleteSpecies = async (req: Request, res: Response) => {
    try {
        const specieId = req.params.specieId;
        const breeds = await BreedModel.find({ specieId });
        if (breeds.length !== 0)
            return badRequest(
                res,
                `There is/are ${breeds.length} breed/s belonging to this species`
            );

        const deletedSpecies = await SpecieModel.findByIdAndDelete(specieId);
        return ok(res, { message: "Sprecie deleted successfully", deletedSpecies });

    } catch (e) {
        console.log(e);
        error(res);
    }
};
