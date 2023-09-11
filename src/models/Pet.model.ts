import { Schema, model } from "mongoose";
import modelOptions from "./modelOptions";
import { type Pet } from "../types/pet.types";

const PetSchema = new Schema<Pet>(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["macho", "hembra"],
      required: true,
    },
    breedId: {
      type: Schema.Types.ObjectId,
      ref: "Breed",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Schema.Types.Number,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    image: [
      {
        _id: false,
        secure_url: String,
        public_id: String,
      },
    ],
  },
  modelOptions
);

const PetModel = model("Pet", PetSchema);
export default PetModel;
