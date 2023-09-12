import { type ObjectId } from "mongoose";

/* MODELS TYPES */
export interface Like {
    userId: ObjectId;
    petId: ObjectId;
    liked: boolean;
    petTargetId: ObjectId;
    ownerPetTargetId: ObjectId;
}
