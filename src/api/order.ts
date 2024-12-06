import express from "express";
import { OrderController } from "../controllers/order.js";

export const orderRouter = express.Router();

orderRouter.get("/:userId", OrderController.call("getByUser"));
orderRouter.get("/details/:orderId", OrderController.call("details"));

orderRouter.post("/", OrderController.call("order"));
