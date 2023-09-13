import { badRequest, created, error, notfound, ok } from "../handlers/response.handler";
import { BreedModel, SpecieModel } from "../models/Breed&Specie.model";
import { Request, Response } from "express";
import PetModel from "../models/Pet.model";

export const createBreed = async ({ body }: Request, res: Response) => {
    try {

        const breed = await BreedModel.create(body);
        return created(res, breed)

    } catch (err) {
        console.log(err);
        return error(res);
    }
}

export const getBreeds = async (req: Request, res: Response) => {
    try {
        const breeds = await BreedModel.find({ specieId: req.params.specieId });
        if (!breeds) return notfound(res, "this specie no have breeds");
        //if (breeds.length == 0) return error(res)
        return ok(res, breeds)

    } catch (err) {
        console.log(err);
        return error(res)
    }
}

export const deleteBreeds = async (req: Request, res: Response) => {
    try {
        const breedId = req.params.breedId;

        const breeds = await PetModel.find({ breedId });

        if (breeds.length !== 0) return badRequest(res, "Breed is in use");

        const deletedBreed = await BreedModel.findByIdAndDelete(breedId);

        return ok(res, { message: "Breed deleted successfully", deletedBreed });
    } catch (e) {
        console.log(e);
        error(res);
    }
};
