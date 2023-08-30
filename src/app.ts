import express from "express";
import cors from "express";
import morgan from "morgan";
import { router } from "./routes";
import fileUpload from "express-fileupload";

const app = express();

/* MIDDLEWARES */
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./upload",
    })
);

app.use(router);

export default app;