import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";
import { Product } from "./product.js";
import { User } from "./user.js";

export class Order extends Model {}

Order.init(
  {
    user_id: { type: DataTypes.NUMBER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    done: { type: DataTypes.BOOLEAN, allowNull: false },
    total: { type: DataTypes.NUMBER, allowNull: false },
  },
  { sequelize, modelName: "order", timestamps: true }
);

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User);

export class OrderedItem extends Model {}

OrderedItem.init(
  {
    order_id: { type: DataTypes.NUMBER, allowNull: false },
    product_id: { type: DataTypes.NUMBER, allowNull: false },
    count: { type: DataTypes.NUMBER, allowNull: false },
    total_price: { type: DataTypes.NUMBER, allowNull: false },
  },
  { sequelize, modelName: "ordered_item", timestamps: true }
);

Order.hasMany(OrderedItem, { foreignKey: "order_id" });
OrderedItem.belongsTo(Order);

Product.hasMany(OrderedItem, { foreignKey: "product_id" });
OrderedItem.belongsTo(Product);
