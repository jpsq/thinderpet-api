import "dotenv/config";

export const PORT = +(process.env.PORT || 3001);
export const DB_URI = process.env.DB_URI as string; //MONGODB
export const SECRET_TOKEN = process.env.SECRET_KEY as string; //JWT
export const KEY_MAIL = process.env.KEY_MAIL as string; //NODEMAILER
export const MY_EMAIL = process.env.MY_EMAIL as string; //NODEMAILER
export const MY_PASSWORD = process.env.MY_PASSWORD as string; //NODEMAILER
export const CLOUDINARY_CLOUD_NAME = process.env
  .CLOUDINARY_CLOUD_NAME as string; //CLOUDINARY
export const CLOUDINARY_API_SECRET = process.env
  .CLOUDINARY_API_SECRET as string; //CLOUDINARY
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string; //CLOUDINARY
