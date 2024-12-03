import express from "express";
import { UserController } from "../controllers/user.js";

export const registerRouter = express.Router();

registerRouter.post("/", UserController.register);
 