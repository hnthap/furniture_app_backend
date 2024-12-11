import { StatusCodes } from "http-status-codes";
import { FavoriteProduct } from "../models/favorite-product.js";
import { Product } from "../models/product.js";
import { BaseController } from "./base.js";

export const FavoriteController = new BaseController({
  get: async (req, res) => {
    try {
      const { userId } = req.params;
      if (userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const favorites = await FavoriteProduct.findAll({
        where: { user_id: userId },
        order: [["updatedAt", "ASC"]],
      });
      const products = await Promise.all(
        favorites.map(
          async (favorite) =>
            await Product.findByPk(favorite.getDataValue("product_id"))
        )
      );
      res.status(StatusCodes.OK).json({ products });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  check: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (userId === undefined || productId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const count = await FavoriteProduct.count({
        where: { user_id: userId, product_id: productId },
      });
      res.status(StatusCodes.OK).json({ favorite: count !== 0 });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  new: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (userId === undefined || productId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const data = { user_id: userId, product_id: productId };
      const favorite = await FavoriteProduct.findOne({ where: data });
      if (favorite === null) {
        await FavoriteProduct.create(data);
      }
      res.status(StatusCodes.OK).json({});
    } catch (error) {
      console.error(`failed to favorite a product, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  delete: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (userId === undefined || productId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const data = { user_id: userId, product_id: productId };
      const rowCount = await FavoriteProduct.destroy({ where: data });
      if (rowCount === 0) {
        res.status(StatusCodes.OK).json({ products: null });
      } else {
        const favorites = await FavoriteProduct.findAll({
          where: { user_id: userId },
        });
        const products = await Promise.all(
          favorites.map(
            async (favorite) =>
              await Product.findByPk(favorite.getDataValue("product_id"))
          )
        );
        res.status(StatusCodes.OK).json({ products });
      }
    } catch (error) {
      console.error(`failed to unfavorite a product, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
});
