import express from "express";
import { loginRouter } from "./api/login.js";
import { registerRouter } from "./api/register.js";
import { productRouter } from "./api/product.js";
import { profileRouter } from "./api/profile.js";

export const apiRouter = express.Router();

apiRouter.use("/login", loginRouter);
apiRouter.use("/register", registerRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/profile", profileRouter);
