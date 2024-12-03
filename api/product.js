import express from "express";
import { ProductController } from "../controllers/product.js";

export const productRouter = express.Router();

productRouter.get("/", ProductController.all);
productRouter.get("/:id", ProductController.get);
productRouter.get("/search/:key", ProductController.search);

productRouter.post("/", ProductController.new);

productRouter.delete("/:id", ProductController.delete);
