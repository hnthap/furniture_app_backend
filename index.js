import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
import { apiRouter } from "./api.js";
import { sequelize } from "./database.js";
import { Product } from "./models/product.js";
import { User } from "./models/user.js";

initializeSequelize()
  .then(() => {
    config();

    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "10mb" }));

    const port = process.env.FURNITURE_BACKEND_PORT ?? "3000";

    app.get("/", (req, res) => {
      res.send({
        message: `Hello! This is the Furniture App Backend REST API.`,
      });
    });
    app.use("/api", apiRouter);

    const server = app.listen(port, () => {
      console.log(
        `🆗 Furniture app backend listening on http://localhost:${port}`
      );
    });
  })
  .catch((reason) => {
    console.error(`Failed to sync database, reason: ${reason}`);
  });

/**
 * Initialize data for development. This function is for development only.
 *
 * TODO: Remove this function before going to production.
 *
 * @returns Sequelize object
 */
export async function initializeSequelize() {
  await sequelize.sync({ force: true });
  // All code goes below is developement only.
  // TODO: Remove them before going to production.
  const productCount = await Product.count();
  if (productCount === 0) {
    const products = JSON.parse(await readFile("scripts/out.json", "utf-8"));
    for (const product of products) {
      await Product.create(product);
    }
    const users = [
      {
        username: "thap",
        email: "thap@gmail.com",
        password: "thap",
        location: "Lang Son, Vietnam",
      },
    ];
    for (const user of users) {
      await User.create(user);
    }
  }
  return sequelize;
}
