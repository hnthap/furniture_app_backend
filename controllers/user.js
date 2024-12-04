import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { Order, OrderedItem } from "../models/order.js";

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
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rowCount = await User.destroy({ where: { id } });
      if (rowCount === 0) {
        res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "delete done, but no rows were affected" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: `successfully deleted product ID ${id}` });
      }
    } catch (error) {
      console.error(`failed to delete products, reason: ${error}`);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to delete products" });
    }
  },
  addCart: async (req, res) => {
    try {
      let { userId: user_id, productId: product_id, count } = req.body;
      count = Number.parseInt(count);
      if (count <= 0 || user_id === undefined || product_id === undefined) {
        console.log(count, user_id, product_id);
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const item = await Cart.findOne({ where: { user_id, product_id } });
      const product = await Product.findByPk(product_id);
      const price = product.getDataValue("price");
      const total_price = Math.floor(price * count + 0.5);
      if (item) {
        item.set({ count, total_price });
        await item.save();
        res.status(StatusCodes.OK).json(item);
      } else {
        const newItem = { user_id, product_id, count, total_price };
        await Cart.create(newItem);
        res.status(StatusCodes.CREATED).json(item);
      }
    } catch (error) {
      console.error("ERROR", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: `failed to add to cart` });
    }
  },
  deleteCart: async (req, res) => {
    try {
      let { userId: user_id, productId: product_id } = req.params;
      if (user_id === undefined || product_id === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      user_id = Number.parseInt(user_id);
      product_id = Number.parseInt(product_id);
      const rowCount = await Cart.destroy({ where: { user_id, product_id } });
      if (rowCount === 0) {
        res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "delete done, but no rows were affected" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: `successfully deleted cart item ID` });
      }
    } catch (error) {
      console.error(`failed to delete cart item, reason: ${error}`);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to delete cart item" });
    }
  },
  getCart: async (req, res) => {
    try {
      const { userId: user_id } = req.params;
      if (user_id === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const items = (await Cart.findAll({ where: { user_id } })).sort();
      const products = await Promise.all(
        items.map(async (value) => {
          const productId = value.getDataValue("product_id");
          const product = await Product.findByPk(productId);
          return product;
        })
      );
      res.status(StatusCodes.OK).json({ items, products });
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get cart items" });
    }
  },
  // countCartProducts: async (req, res) => {
  //   try {
  //     const { userId: user_id } = req.params;
  //     if (user_id === undefined) {
  //       res
  //         .status(StatusCodes.BAD_REQUEST)
  //         .json({ message: `invalid argument` });
  //       return;
  //     }
  //     const items = await Cart.findAll({ where: { user_id } });
  //     res.status(StatusCodes.OK).json({ count: items.length });
  //   } catch {
  //     res
  //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ message: "failed to count cart products" });
  //   }
  // },
  orderOne: async (req, res) => {
    try {
      const { cartId, address } = req.body;
      if (cartId === undefined || address === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const item = await Cart.findByPk(cartId);
      const total = item.getDataValue("total_price");
      const order = await Order.create({
        date: new Date(Date.now()),
        done: true,
        user_id: item.getDataValue("user_id"),
        total,
        address,
      });
      const orderedItem = await OrderedItem.create({
        order_id: order.getDataValue("id"),
        product_id: item.getDataValue("product_id"),
        count: item.getDataValue("count"),
        total_price: total,
      });
      res.status(StatusCodes.OK).json({ order, items: [orderedItem] });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to order one item" });
    }
  },
  orderAll: async (req, res) => {
    try {
      const { userId, address } = req.body;
      if (userId === undefined || address === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const items = (await Cart.findAll({ where: { user_id: userId } })).sort();
      const products = await Promise.all(
        items.map(async (value) => {
          const productId = value.getDataValue("product_id");
          const product = await Product.findByPk(productId);
          return product;
        })
      );
      const total = items.reduce(
        (prev, curr) => prev + curr.getDataValue("total_price"),
        0
      );
      const order = await Order.create({
        date: new Date(Date.now()),
        done: true,
        user_id: userId,
        total,
        address,
      });
      const orderedItems = await Promise.all(
        items.map(async (item) => {
          return await OrderedItem.create({
            order_id: order.getDataValue("id"),
            product_id: item.getDataValue("product_id"),
            count: item.getDataValue("count"),
            total_price: item.getDataValue("total_price"),
          });
        })
      );
      res.status(StatusCodes.OK).json({ order, items: orderedItems });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to order all items" });
    }
  },
  getOrders: async (req, res) => {
    try {
      const { userId } = req.params;
      if (userId === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const orders = await Order.findAll({
        where: { user_id: userId },
        order: [["date", "DESC"]],
      });
      res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get orders" });
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      const { orderId } = req.params;
      if (orderId === undefined) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `invalid argument` });
        return;
      }
      const order = await Order.findByPk(orderId);
      const items = await Order.findAll({ where: { order_id: orderId } });
      res.status(StatusCodes.OK).json({ order, items });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get order details" });
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
