import express from "express";
import { User } from "../database.js";

export const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  const { username, email, location, password } = req.body;
  const user = await User.create({ username, email, location, password });
  const message = { user: user.dataValues };
  console.log(message);
  res.json(message);
  res.status(201);
});
 