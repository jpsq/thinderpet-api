import { badRequest, error, notfound, ok } from "../handlers/response.handler";
import PetModel from "../models/Pet.model";
import UserModel from "../models/User.model";
import LikeModel from "../models/like.model";
import { type Request, type Response } from "express";

export const likePet = async (req: Request, res: Response) => {

    const { petId } = req.body; // mascota del usuario que esta dando like 
    const { pet_target_id } = req.body; // mascota ajena a la que se le da like

    try {
        // Compruebo si ya existe un registro de "like" para esta mascota y usuario
        const existingLike = await LikeModel.findOne({
            petId: petId,
            petTargetId: pet_target_id,
        });

        if (existingLike) {
            // Si el usuario ya dio "like," actualiza el valor de "liked" a true
            existingLike.liked = true;
            await existingLike.save();
        } else {
            // Si no existe un registro, creo uno nuevo

            const pet = await PetModel.findById(petId);
            if (!pet) return badRequest(res, "pet from petId not found");

            const target_pet = await PetModel.findById(pet_target_id);
            if (!target_pet) return badRequest(res, "pet from pet_target_id id not found");

            await LikeModel.create({
                userId: pet.ownerId,
                petTargetId: pet_target_id,
                petId: petId,
                ownerPetTargetId: target_pet.ownerId,
                liked: true,
            });
        }

        // Verificar si el dueño de la mascota también le dio "like" a la mascota del usuario1
        const mutualLike = await LikeModel.findOne({
            petId: pet_target_id, // El usuario dueño de la mascota a la que se dio "like"
            petTargetId: petId, // La mascota del usuario1
            liked: true,
        });

        if (mutualLike) {
            // realizar acciones adicionales aquí, como notificar a los usuarios.

            res.json({ message: "Match!" });
        } else {
            res.json({ message: "Like succesfully." });
        }
    } catch (err) {
        console.log(err);
        return error(res);
    }
}

export const verifyMatches = async (req: Request, res: Response) => {

    const userId = req.params.userId; // Obtener el ID del usuario autenticado

    const user = await UserModel.findById(userId);
    if (!user) return badRequest(res, "User not found")

    try {
        // Buscar todos los registros de "like" donde el usuario dueño de la mascota sea el actual
        const likes = await LikeModel.find({
            userId: userId, // El usuario dueño de la mascota
            liked: true,
        }).populate("petTargetId", "name");

        if (likes.length > 0) {
            //por cada like dado por el usuario
            const matches = await Promise.all(likes.map(async (like) => {

                //verifico si existe el like contrario, lo que indicaria un match
                const reverseLike = await LikeModel.findOne({
                    ownerPetTargetId: userId, // El dueño objetivo es este usuario
                    userId: like.ownerPetTargetId, // El usuario objetivo hizo el este like
                    petTargetId: like.petId, //la mascota objetivo es la mascota del usuario
                    petId: like.petTargetId, //la mascota del like es la mascota objetivo
                    liked: true,
                }).populate("petTargetId", "name");

                if (reverseLike) return reverseLike;
            }));

            return ok(res, matches);

        } else {
            return notfound(res, "no matches")
        }
    } catch (err) {
        console.error(err);
        return error(res);
    }
}