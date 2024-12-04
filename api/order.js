import express from "express";
import { UserController } from "../controllers/user.js";

export const orderRouter = express.Router();

orderRouter.get("/:userId", UserController.getOrders);
orderRouter.get("/details/:orderId", UserController.getOrderDetails);

orderRouter.post("/all", UserController.orderAll);
orderRouter.post("/one", UserController.orderOne);
