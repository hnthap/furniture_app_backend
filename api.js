import express from "express";
import { greetRouter } from "./api/greet.router.js";
import { loginRouter } from "./api/login.router.js";
import { registerRouter } from "./api/register.router.js";

export const apiRouter = express.Router();

apiRouter
  .use("/greet", greetRouter)
  .use("/login", loginRouter)
  .use("/register", registerRouter);
