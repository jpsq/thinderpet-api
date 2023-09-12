import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes";

const app = express();

/* MIDDLEWARES */

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

export default app;
