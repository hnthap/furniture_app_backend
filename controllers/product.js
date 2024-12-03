import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Product } from "../models/product.js";

export const ProductController = {
  new: async (req, res) => {
    const { title, supplier, base64, description, product_location, price } =
      req.body;
    try {
      const product = await Product.create({
        title,
        supplier,
        base64,
        description,
        product_location,
        price,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "product created successfully" });
    } catch (error) {
      console.error(`failed to create product, reason: ${error}`);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to create product` });
    }
  },
  all: async (req, res) => {
    try {
      const products = (await Product.findAll()).sort();
      res.status(StatusCodes.OK).json({ products });
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get all products" });
    }
  },
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      res.status(StatusCodes.OK).json({ product });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to get product ID ${id}` });
    }
  },
  search: async (req, res) => {
    try {
      const { key } = req.params;
      const condition = { [Op.like]: `%${key}%` };
      const products = await Product.findAll({
        where: {
          [Op.or]: {
            title: condition,
            supplier: condition,
            description: condition,
          },
        },
      });
      res.status(StatusCodes.OK).json({ products });
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to find products" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rowCount = await Product.destroy({ where: { id } });
      if (rowCount === 0) {
        res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "delete done, but no rows were affected" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: `successfully deleted product ID ${id}` });
      }
    } catch (error) {
      console.error(`failed to delete products, reason: ${error}`);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to delete products" });
    }
  },
};
