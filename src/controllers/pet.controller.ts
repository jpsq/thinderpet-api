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
  badRequest,
} from "../handlers/response.handler";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

// [POST] create Pet
export const createPet = async (
  { body }: Request<any, any, PetRequest>,
  res: Response
) => {
  try {
    const pet = await PetModel.create({ ...body });
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
  try {
    const petId = params.petId;

    const updatedPet = await PetModel.findByIdAndUpdate(petId, body, {
      new: true,
    }).populate({
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
};

export const deletePet = async (req: Request, res: Response) => {
  try {
    const petId = req.params.petId;

    const pet = await PetModel.findById(petId);
    if (!pet) return badRequest(res, `Pet not exist`);

    if (pet.image && pet.image.length > 0) {
      for (const imageObj of pet.image) {
        if (imageObj.public_id) {
          await deleteImage(imageObj.public_id);
        }
      }
    }
    pet.image = [];

    const deletedPet = await PetModel.findByIdAndDelete(petId);

    return ok(res, {
      message: "Pet was deleted successfully",
      deletedPet,
    });
  } catch (e) {
    console.log(e);
    error(res);
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    const petId = req.params.petId;

    const pet = await PetModel.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron imágenes." });
    }

    const imageInfoArray: {
      secure_url: string;
      public_id: string;
    }[] = [];

    // Itera sobre los archivos subidos y realiza las acciones necesarias para cada uno
    for (const file of req.files as Express.Multer.File[]) {
      const result = await uploadImage(file.path); // Sube la imagen a Cloudinary

      const imageUrl = result.secure_url;
      const publicId = result.public_id;

      await fs.promises.unlink(file.path);

      imageInfoArray.push({ secure_url: imageUrl, public_id: publicId });
    }

    // Actualiza el campo 'image'
    await PetModel.findByIdAndUpdate(petId, {
      $push: { image: { $each: imageInfoArray } },
    });

    return res.status(200).json({ imageInfoArray });
  } catch (error) {
    console.error("Error durante la subida de las imágenes:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};
