import { StatusCodes } from "http-status-codes";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { BaseController } from "./base.js";

export const CartController = new BaseController({
  add: async (req, res) => {
    try {
      let { userId: user_id, productId: product_id, count } = req.body;
      count = Number.parseInt(count);
      if (count <= 0 || user_id === undefined || product_id === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const item = await Cart.findOne({ where: { user_id, product_id } });
      const product = await Product.findByPk(product_id);
      if (product === null) {
        res.status(StatusCodes.NOT_FOUND).json({});
        return;
      }
      const price = product.getDataValue("price");
      const total_price = Math.floor(price * count + 0.5);
      if (item) {
        item.set({ count, total_price });
        await item.save();
        res.status(StatusCodes.OK).json(item);
      } else {
        const newItem = { user_id, product_id, count, total_price };
        await Cart.create(newItem);
        res.status(StatusCodes.OK).json(item);
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  delete: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (userId === undefined || userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const user_id = Number.parseInt(userId);
      const product_id = Number.parseInt(productId);
      const rowCount = await Cart.destroy({ where: { user_id, product_id } });
      if (rowCount === 0) {
        res.status(StatusCodes.NOT_FOUND).json({});
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: `successfully deleted cart item ID` });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  get: async (req, res) => {
    try {
      const { userId: user_id } = req.params;
      if (user_id === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const items = (await Cart.findAll({ where: { user_id } })).sort();
      const products = await Promise.all(
        items.map(async (value) => {
          const productId = value.getDataValue("product_id");
          const product = await Product.findByPk(productId);
          return product;
        })
      );
      res.status(StatusCodes.OK).json({ items, products });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  count: async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (userId === undefined || productId === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const count = await Cart.count({
        where: { user_id: userId, product_id: productId },
      });
      res.status(StatusCodes.OK).json({ count });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
  countTitles: async (req, res) => {
    try {
      const { userId: user_id } = req.params;
      if (user_id === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({});
        return;
      }
      const count = await Cart.count({ where: { user_id } });
      res.status(StatusCodes.OK).json({ count });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
  },
});
