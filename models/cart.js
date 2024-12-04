import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Product } from "./product.js";

export class Cart extends Model {}

Cart.init(
  {
    user_id: { type: DataTypes.NUMBER, allowNull: false },
    product_id: { type: DataTypes.NUMBER, allowNull: false },
    count: { type: DataTypes.NUMBER, allowNull: false },
    total_price: { type: DataTypes.NUMBER, allowNull: false },
  },
  { sequelize, modelName: "cart", timestamps: true }
);

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User);

Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product);
