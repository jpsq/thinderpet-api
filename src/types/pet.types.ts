import { type ObjectId } from "mongoose";

/* MODELS TYPES */
export interface Pet {
  name: string;
  gender: "macho" | "hembra";
  breedId: ObjectId;
  ownerId: ObjectId;
  age: number;
  description: string;
  image?: {
    secure_url: string;
    public_id: string;
  }[];
}

/* USER RESPONSE TYPE */

export type PetRequest = Pet;
