import express from "express";
import { FavoriteController } from "../controllers/favorite.js";

export const favoriteRouter = express.Router();

favoriteRouter.get("/:userId", FavoriteController.call("get"));
favoriteRouter.get("/:userId/:productId", FavoriteController.call("check"));

favoriteRouter.post("/:userId/:productId", FavoriteController.call("new"));

favoriteRouter.delete("/:userId/:productId", FavoriteController.call("delete"));
