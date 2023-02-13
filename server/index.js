import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import router from "./routes/index.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send({ error: err.message });
});

app.listen(PORT);
