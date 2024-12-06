import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";
import { Product } from "./product.js";
import { User } from "./user.js";

export class FavoriteProduct extends Model {}

FavoriteProduct.init(
  {
    user_id: { type: DataTypes.NUMBER, allowNull: false },
    product_id: { type: DataTypes.NUMBER, allowNull: false },
  },
  { sequelize, modelName: "favorite_product", timestamps: true }
);

User.hasMany(FavoriteProduct, { foreignKey: "user_id" });
FavoriteProduct.belongsTo(User);

Product.hasMany(FavoriteProduct, { foreignKey: "product_id" });
FavoriteProduct.belongsTo(Product);
