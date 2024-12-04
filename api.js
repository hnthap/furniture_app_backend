import express from "express";
import { cartRouter } from "./api/cart.js";
import { loginRouter } from "./api/login.js";
import { productRouter } from "./api/product.js";
import { profileRouter } from "./api/profile.js";
import { registerRouter } from "./api/register.js";
import { orderRouter } from "./api/order.js";

export const apiRouter = express.Router();

apiRouter.use("/cart", cartRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/register", registerRouter);
apiRouter.use("/order", orderRouter);
