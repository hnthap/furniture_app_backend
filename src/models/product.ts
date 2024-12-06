import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class Product extends Model {}

Product.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    supplier: { type: DataTypes.STRING, allowNull: false },
    base64: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    product_location: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "product", timestamps: true }
);
