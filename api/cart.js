import express from "express";
import { UserController } from "../controllers/user.js";

export const cartRouter = express.Router();

cartRouter.get("/:userId", UserController.getCart);

cartRouter.post("/", UserController.addCart);

cartRouter.delete("/:userId/:productId", UserController.deleteCart);
