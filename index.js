import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { apiRouter } from "./api.js";
import { sequelize } from "./database.js";

await sequelize.sync();
config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.FURNITURE_BACKEND_PORT ?? "3000";

app.get("/", (req, res) => {
  res.send({
    message: `Hello! This is the Furniture App Backend REST API.`,
  });
});

app.use("/api", apiRouter);

const server = app.listen(port, () => {
  console.log(`🆗 Furniture app backend listening on http://localhost:${port}`);
});
