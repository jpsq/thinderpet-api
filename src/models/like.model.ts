import { Schema, model } from "mongoose";

const LikeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    petId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    petTargetId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    liked: {
        type: Boolean,
        default: false,
    },
    ownerPetTargetId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const LikeModel = model("Like", LikeSchema);
export default LikeModel;
