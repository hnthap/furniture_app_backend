import express from "express";
import { ProductController } from "../controllers/product.js";

export const productRouter = express.Router();

productRouter.get("/", ProductController.call("all"));
productRouter.get("/:id", ProductController.call("get"));
productRouter.get("/search/:key", ProductController.call("search"));

productRouter.post("/", ProductController.call("new"));

productRouter.delete("/:id", ProductController.call("delete"));
