import { type ObjectId } from "mongoose";

/* MODELS TYPES */
export interface Pet {
  name: string;
  gender: "macho" | "hembra";
  breedId: ObjectId;
  ownerId: ObjectId;
  age: number;
  photos: Object;
  description: string;
}

/* USER RESPONSE TYPE */

export type PetRequest = Omit<Pet, "ownerId">;
