/// <reference path="../types/custom.d.ts" />
import axios from "axios";
import { filteredMatch, count } from "../utils/queryFilter";
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
import { calcularDistancia } from "../utils/distances";

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

// [GET] get Pets
export const getPets = async (req: Request, res: Response) => {
    try {

        const pet = await PetModel.findById(req.params.petId)
            .populate({
                path: "ownerId",
                select: ["-createdAt", "-updatedAt", "-password", "-salt"]
            })
        if (!pet) { return notfound(res) }

        const ownerPet = pet.ownerId;
        const latitudPet = +(ownerPet.latitud as number);
        const longitudPet = +(ownerPet.longitud as number);

        const ownerIdToExclude = ownerPet.id; // ID del propio dueño

        const proposedPets = await PetModel.find({
            ownerId: { $ne: ownerIdToExclude } // Evita que se traigan las mascotas del propio dueño
        })
            .select(["-createdAt", "-updatedAt"])
            .populate({
                path: "breedId",
                select: ["-createdAt", "-updatedAt"],
                populate: {
                    path: "specieId",
                    select: ["-createdAt", "-updatedAt"]
                }
            })
            .populate({
                path: "ownerId",
                select: ["-createdAt", "-updatedAt", "-password", "-salt"]
            });


        const sortedPets = proposedPets.map((proposedPet: any) => {
            const ownerProposedPet = proposedPet.ownerId;
            const latitudProposedPet = +(ownerProposedPet.latitud as number);
            const longitudProposedPet = +(ownerProposedPet.longitud as number);
            return {
                proposedPet,
                distanceToPet: calcularDistancia(latitudPet, longitudPet, latitudProposedPet, longitudProposedPet)
            }
        })

        sortedPets.sort((a, b) => a.distanceToPet - b.distanceToPet);

        return ok(res, {
            info: {
                totalPets: await count(PetModel, req, sortedPets),
            },
            result: sortedPets
        });
    } catch (e) {
        console.log(e);
        error(res);
    }
};

export const getUserPets = async ({ params }: Request, res: Response) => {
    try {
        const pets = await PetModel.find({ ownerId: params.ownerId })
            .select(["-createdAt", "-updatedAt"])
            .populate({
                path: "breedId",
                select: ["-createdAt", "-updatedAt"],
                populate: {
                    path: "specieId",
                    select: ["-createdAt", "-updatedAt"]
                }
            });

        if (pets.length === 0) return notfound(res);

        return ok(res, pets);
    } catch (e) {
        console.log(e);
        error(res);
    }
};

