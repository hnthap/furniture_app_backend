import express from "express";
import { CartController } from "../controllers/cart.js";

export const cartRouter = express.Router();

cartRouter.get("/:userId", CartController.call("get"));
cartRouter.get("/count/:userId", CartController.call("countTitles"));
cartRouter.get("/count/:userId/:productId", CartController.call("count"));

cartRouter.post("/", CartController.call("add"));

cartRouter.delete("/:userId/:productId", CartController.call("delete"));
