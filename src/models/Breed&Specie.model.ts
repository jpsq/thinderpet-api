import { Schema, model } from "mongoose";
import modelOptions from "./modelOptions";
import { type Breed, type Specie } from "../types/breed&specie.types";

const BreedSchema = new Schema<Breed>(
  {
    breed: {
      type: String,
      required: true,
      unique: true
    },
    specieId: {
      type: Schema.Types.ObjectId,
      ref: "Specie",
      required: true
    }
  },
  modelOptions
);

const SpecieSchema = new Schema<Specie>(
  {
    specie: {
      type: String,
      required: true,
      unique: true
    }
  },
  modelOptions
);

const BreedModel = model("Breed", BreedSchema);
const SpecieModel = model("Specie", SpecieSchema);

export { BreedModel, SpecieModel };
