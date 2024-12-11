import express from "express";
import { UserController } from "../controllers/user.js";

export const profileRouter = express.Router();

profileRouter.get("/:id", UserController.call("get"));

profileRouter.put("/:id", UserController.call("update"));
profileRouter.put("/:id/avatar", UserController.call("changeAvatar"));
profileRouter.put("/:id/cover", UserController.call("changeCover"));

profileRouter.delete("/:id", UserController.call("delete"));
