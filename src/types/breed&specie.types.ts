import { type ObjectId } from "mongoose";

/* MODELS TYPES */

export interface Specie {
  specie: string;
}

export interface Breed {
  breed: string;
  specieId: ObjectId;
}
