import express from "express";
import { User } from "../database.js";

export const loginRouter = express.Router();

// TODO: Properly encrypt the password from client side
loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user === null) {
    console.log(
      `login failed: user with ${JSON.stringify({
        email,
        password,
      })} is not found`
    );
    res.status(404);
    return;
  }
  const message = { user: user.dataValues };
  console.log(message);
  res.json(message);
});
