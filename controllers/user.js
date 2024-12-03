import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";

export const UserController = {
  register: async (req, res) => {
    // TODO: encrypt the password
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const location = req.body.location.trim();
    const password = req.body.password;
    if (username.length < 5) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username must be at least 5 character long" });
      return;
    }
    // TODO: validate email
    if (email.length === 0 || (await existsUser(email))) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email already registered" });
      return;
    }
    try {
      await User.create({
        username,
        email,
        location,
        password,
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "user created successfully" });
    } catch (error) {
      console.log(`failed to create user, reason: ${error}`);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to create user` });
    }
  },
  login: async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    if (email.length === 0 || password.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email or password must not be empty" });
      return;
    }
    try {
      const user = await User.findOne({ where: { email, password } });
      if (user) {
        res.status(StatusCodes.CREATED).json({ user });
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: `Email or password do not match` });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to login` });
    }
  },
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to retrieve user information` });
    }
  },
};

async function existsUser(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return user ? true : false;
  } catch (error) {
    console.error(error);
  }
}
