import multer from "multer";
import { Request, Response } from "express";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/gif",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Acepta el archivo
    cb(null, true);
  } else {
    // Rechaza el archivo
    cb(new Error("Tipo de archivo no permitido."));
  }
};

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "./uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, file.originalname);
  },
});

export const uploads = multer({ storage: storage, fileFilter });
