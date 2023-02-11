import express from "express";
import { PORT } from "./config.js";
import router from "./routes/index.routes.js";

const app = express();

app.use(router);
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);