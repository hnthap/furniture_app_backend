import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
import { apiRouter } from "./api.js";
import { sequelize } from "./database.js";
import { Product } from "./models/product.js";
import { User } from "./models/user.js";
import { Order, OrderedItem } from "./models/order.js";
import { Cart } from "./models/cart.js";

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
    const orders = [
      {
        user_id: 1,
        date: new Date(Date.now()),
        address: "Quang Ngai, Vietnam",
        done: true,
        total: 19994,
      },
    ];
    for (const order of orders) {
      await Order.create(order);
    }
    const orderedItems = [
      {
        order_id: 1,
        product_id: 1,
        count: 1,
        total_price: 2999,
      },
      {
        order_id: 1,
        product_id: 2,
        count: 2,
        total_price: 7998,
      },
      {
        order_id: 1,
        product_id: 3,
        count: 3,
        total_price: 8997,
      },
    ];
    for (const orderedItem of orderedItems) {
      await OrderedItem.create(orderedItem);
    }
    const carts = [
      {
        user_id: 1,
        product_id: 6,
        count: 1,
        total_price: 1599,
      },
    ];
    for (const cart of carts) {
      await Cart.create(cart);
    }
  }
  return sequelize;
}
