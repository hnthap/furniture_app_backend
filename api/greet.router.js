import express from "express";

export const greetRouter = express.Router();

greetRouter.get("/:name", (req, res) => {
  res.send({
    message: `Hello, ${req.params.name}! This is the Furniture App Backend REST API.`,
  });
});
