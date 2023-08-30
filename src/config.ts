import "dotenv/config";

export const PORT = +(process.env.PORT || 3001);
export const DB_URI = process.env.DB_URI as string; //MONGODB
export const SECRET_TOKEN = process.env.SECRET_KEY as string; //JWT

