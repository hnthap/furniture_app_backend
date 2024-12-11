import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class User extends Model {}

User.init(
  {
    username: DataTypes.TEXT,
    email: DataTypes.TEXT,
    location: DataTypes.TEXT,
    password: DataTypes.TEXT,
    avatar_base64: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_base64: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "user", timestamps: true }
);
