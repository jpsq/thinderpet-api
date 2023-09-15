import { body, type ValidationChain } from "express-validator";
import PetModel from "../models/Pet.model";

export const nameregex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // regular expression with de spanish simbols and spaces

export const nameValidation = (isPut: boolean): ValidationChain[] => {

  const postValidators: ValidationChain[] = [
    body("name").exists()
      .withMessage("name is required")
      .isString()
      .withMessage("pet name has to be string")
      .isLength({ min: 2, max: 20 })
      .withMessage("name minimun 2 characters")
      .matches(nameregex)
      .withMessage("name can only contain letters and spaces")
      .custom(async (value, { req }) => {
        const pet = await PetModel.find({
          name: value,
          userId: req.body.userId
        });
        if (pet.length !== 0)
          throw new Error("The user already have a pet with this name");
        return false;
      })
  ];

  // el siguiente validador hara que aunque se ingrese el mismo nombre a la mascota rechace la peticion de put
  const putValidators: ValidationChain[] = [
    body("name").optional().isString()
      .withMessage("name has to be string")
      .isLength({ min: 2, max: 20 })
      .withMessage("name minimun 3 characters and max 20 characters")
      .matches(nameregex)
      .withMessage("name can only contain letters and spaces")
      .custom(async (value, { req }) => {
        const pet = await PetModel.find({
          name: value,
          userId: req.body.userId
        });
        if (pet.length !== 0)
          throw new Error("The user already have a pet with this name");
        return false;
      })
  ];

  return !isPut ? postValidators : putValidators;
};

export const genderValidation = (isPut: boolean): ValidationChain[] => {
  const postValidators: ValidationChain[] = [
    body("gender")
      .exists().withMessage("gender is required").isIn(["macho", "hembra"])
      .withMessage("gender has to be equal to 'macho' or 'hembra'")
  ];

  const putValidators: ValidationChain[] = [
    body("gender").optional().isIn(["macho", "hembra"])
      .withMessage("gender has to be equal to 'macho' or 'hembra'")
  ];

  return !isPut ? postValidators : putValidators;
};
