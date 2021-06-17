import bcrypt from "bcryptjs";
import express from "express";
import config from "config";
import jwt from "express-jwt";
import User from "../models/User";
import expressjwtOptions from "../utils/expressJwtConstructor";

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

usersRouter.use(jwt(expressjwtOptions));

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.get("/:id", async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  res.json(user);
});

usersRouter.delete("/", async (req, res, next) => {
  const { body } = req;
  if (!body.username) return next({ code: 400, message: "Bad request" });
  const user = (await User.findOne({ username: body.username })) as any;
  if (user === null) {
    return next({ code: 404, message: `[404] Not Found ${body.username}` });
  }
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  await User.findOneAndDelete({ username: body.username });
  res.status(204).end();
});

export default usersRouter;
