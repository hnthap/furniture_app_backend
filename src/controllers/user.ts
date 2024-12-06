import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import { existsUser } from "../utils.js";
import { BaseController } from "./base.js";

export const UserController = new BaseController({
  register: async (req, res) => {
    // TODO: encrypt the password
    let username = req.body.username;
    let email = req.body.email;
    let location = req.body.location;
    let password = req.body.password;
    if (
      username === undefined ||
      email === undefined ||
      location === undefined ||
      password === undefined
    ) {
      res.status(StatusCodes.BAD_REQUEST);
      return;
    }
    username = username.trim();
    email = email.trim();
    location = location.trim();
    try {
      if (username.length < 3) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      // TODO: validate email
      if (email.length === 0 || (await existsUser(email))) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      await User.create({
        username,
        email,
        location,
        password,
      });
      res.status(StatusCodes.CREATED);
    } catch (error) {
      console.log(`failed to create user, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  login: async (req, res) => {
    let { email, password } = req.body;
    if (email === undefined || password === undefined) {
      res.status(StatusCodes.BAD_REQUEST);
      return;
    }
    email = email.trim();
    if (email.length === 0 || password.length === 0) {
      res.status(StatusCodes.BAD_REQUEST);
      return;
    }
    try {
      const user = await User.findOne({ where: { email, password } });
      if (user) {
        res.status(StatusCodes.OK).json({ user });
      } else {
        res.status(StatusCodes.NOT_FOUND);
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  get: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rowCount = await User.destroy({ where: { id } });
      if (rowCount === 0) {
        res.status(StatusCodes.NOT_FOUND);
      } else {
        res.status(StatusCodes.OK).json({});
      }
    } catch (error) {
      console.error(`failed to delete products, reason: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  update: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { username, email, location } = req.body;
      if (
        username === undefined ||
        email === undefined ||
        location === undefined
      ) {
        res.status(StatusCodes.BAD_REQUEST);
        return;
      }
      await User.update({ username, email, location }, { where: { id } });
      res.status(StatusCodes.OK).json({});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
});
