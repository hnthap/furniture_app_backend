import express from "express";
import { UserController } from "../controllers/user.js";

export const profileRouter = express.Router();

profileRouter.get("/:id", UserController.get);
