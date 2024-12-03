import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class User extends Model {}

User.init(
  {
    username: DataTypes.TEXT,
    email: DataTypes.TEXT,
    location: DataTypes.TEXT,
    password: DataTypes.TEXT,
  },
  { sequelize, modelName: "user" }
);
