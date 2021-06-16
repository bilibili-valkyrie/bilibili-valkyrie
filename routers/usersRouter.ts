import bcrypt from "bcryptjs";
import express from "express";
import config from "config";
import User from "../models/User";

const usersRouter = express.Router();
const saltRounds = config.get("bcryptConfig.saltRounds") as number;

require("express-async-errors");

usersRouter.post("/", async (req, res) => {
  const { body } = req;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.json(savedUser);
});

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

export default usersRouter;
