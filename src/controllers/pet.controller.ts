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
        const pet = PetModel.create({ ...body })
        return created(res, pet);

    } catch (e) {
        console.log(e);
        error(res);
    }
};

// [PUT] update Pet by petId
export const updatePet = async (
    { body, params }: Request<any, any, PetRequest>,
    res: Response
) => {

};


export const getPet = async ({ params }: Request, res: Response) => {

};

// [DELETE] delete Pet
export const deletePet = async (req: Request, res: Response) => {

};
