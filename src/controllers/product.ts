import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Product } from "../models/product.js";
import { BaseController } from "./base.js";

export const ProductController = new BaseController({
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
      res.status(StatusCodes.CREATED);
    } catch (error) {
      console.error(`failed to create product, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  all: async (req, res) => {
    try {
      const products = (await Product.findAll()).sort();
      res.status(StatusCodes.OK).json({ products });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      res.status(StatusCodes.OK).json({ product });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rowCount = await Product.destroy({ where: { id } });
      if (rowCount === 0) {
        res.status(StatusCodes.NOT_FOUND);
      } else {
        res.status(StatusCodes.OK);
      }
    } catch (error) {
      console.error(`failed to delete products, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
});
