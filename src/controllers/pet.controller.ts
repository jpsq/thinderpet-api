/// <reference path="../types/custom.d.ts" />
import axios from "axios";
import { type Request, type Response } from "express";
import { type PetRequest } from "../types/pet.types";
import PetModel from "../models/Pet.model";
import {
    created,
    error,
    ok,
    notfound,
    badRequest
} from "../handlers/response.handler";

// [POST] create Pet
export const createPet = async (
    { body }: Request<any, any, PetRequest>,
    res: Response
) => {
    try {
        const pet = await PetModel.create({ ...body })
        return created(res, pet);
    } catch (e) {
        console.log(e);
        error(res);
    }
};

// [PUT] update Pet by petId
export const updatePet = async ({ body, params }: Request<any, any, PetRequest>, res: Response) => {
    try {
        const petId = params.petId;

        const updatedPet = await PetModel.findByIdAndUpdate(petId, body, { new: true }).populate({
            path: "breedId",
            select: ["breed", "specieId"],
            populate: {
                path: "specieId",
                select: ["-createdAt", "-updatedAt"],
            },
        });

        return ok(res, updatedPet);
    } catch (e) {
        console.log(e);
        error(res);
    }
};

export const getPet = async ({ params }: Request, res: Response) => {
    try {
        const pet = await PetModel.findById(params.petId)
            .select(["-createdAt", "-updatedAt"])
            .populate({
                path: "breedId",
                select: ["-createdAt", "-updatedAt"],
                populate: {
                    path: "specieId",
                    select: ["-createdAt", "-updatedAt"],
                },
            })
            .populate({
                path: "ownerId",
                select: ["-createdAt", "-updatedAt", "-password", "-salt"],
            });

        if (!pet) return badRequest(res, "Pet not exist");

        return ok(res, pet);
    } catch (e) {
        console.log(e);
        error(res);
    }
}

export const deletePet = async (req: Request, res: Response) => {
    try {
        const petId = req.params.petId;

        const pet = await PetModel.findById(petId);
        if (!pet) return badRequest(res, `Pet not exist`);

        const deletedPet = await PetModel.findByIdAndDelete(petId);

        return ok(res, {
            message: "Pet was deleted successfully",
            deletedPet
        });
    } catch (e) {
        console.log(e);
        error(res);
    }
};

