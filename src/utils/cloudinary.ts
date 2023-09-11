import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
} from "../config";

// Configura Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para cargar una imagen
export const uploadImage = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "replit",
  });
  return result;
};

// Función para eliminar una imagen
export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
