/// <reference path="./types/custom.d.ts" />
import app from "./app";
import dbInit from "./db/mongo";
import { PORT } from "./config";

dbInit().then();
app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
