import express from "express";
import { UserController } from "../controllers/user.js";

export const loginRouter = express.Router();

loginRouter.post("/", UserController.login);
