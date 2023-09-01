import "dotenv/config";

export const PORT = +(process.env.PORT || 3001);
export const DB_URI = process.env.DB_URI as string; //MONGODB
export const SECRET_TOKEN = process.env.SECRET_KEY as string; //JWT
export const KEY_MAIL = process.env.KEY_MAIL as string; //NODEMAILER
export const MY_EMAIL = process.env.MY_EMAIL as string; //NODEMAILER
export const MY_PASSWORD = process.env.MY_PASSWORD as string; //NODEMAILER
