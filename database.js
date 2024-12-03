import { DataTypes, Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "assets/furniture_backend.dev.db",
});

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
