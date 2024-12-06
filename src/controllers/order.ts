import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Cart } from "../models/cart.js";
import { Order, OrderedItem } from "../models/order.js";
import { Product } from "../models/product.js";
import { BaseController } from "./base.js";

export const OrderController = new BaseController({
  order: async (req, res) => {
    try {
      const { userId, address, cartIds } = req.body;
      if (
        userId === undefined ||
        address === undefined ||
        cartIds === undefined
      ) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      const where = { user_id: userId, id: { [Op.in]: cartIds } };
      const items = (await Cart.findAll({ where })).sort();
      const products = await Promise.all(
        items.map(async (value) => {
          const productId = value.getDataValue("product_id");
          const product = await Product.findByPk(productId);
          return product;
        })
      );
      const total = items.reduce(
        (prev, curr) => prev + curr.getDataValue("total_price"),
        0
      );
      const order = await Order.create({
        date: new Date(Date.now()),
        done: true,
        user_id: userId,
        total,
        address,
      });
      const orderedItems = await Promise.all(
        items.map(async (item) => {
          return await OrderedItem.create({
            order_id: order.getDataValue("id"),
            product_id: item.getDataValue("product_id"),
            count: item.getDataValue("count"),
            total_price: item.getDataValue("total_price"),
          });
        })
      );
      await Cart.destroy({ where });
      res.status(StatusCodes.OK).json({ order, items: orderedItems, products });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      if (userId === undefined) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      const orders = await Order.findAll({
        where: { user_id: userId },
        order: [
          ["date", "DESC"],
          ["done", "ASC"],
        ],
      });
      res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  details: async (req, res) => {
    try {
      const { orderId } = req.params;
      if (orderId === undefined) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      const order = await Order.findByPk(orderId);
      const items = await OrderedItem.findAll({ where: { order_id: orderId } });
      const products = await Promise.all(
        items.map(
          async (item) =>
            await Product.findByPk(item.getDataValue("product_id"))
        )
      );
      res.status(StatusCodes.OK).json({ order, items, products });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
});
