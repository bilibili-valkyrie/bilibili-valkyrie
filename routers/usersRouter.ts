import bcrypt from "bcryptjs";
import express from "express";
import config from "config";
import { Base64 } from "js-base64";
import jwt from "express-jwt";
import User from "../models/User";
import expressjwtOptions from "../utils/expressJwtConstructor";
import Uper from "../models/Uper";
import Video from "../models/Video";
import NotAllowedToSignUpError from "../errors/NotAllowedToSignUpError";
import ConflictError from "../errors/ConflictError";

const usersRouter = express.Router();
const saltRounds = config.get("bcryptConfig.saltRounds") as number;

require("express-async-errors");

usersRouter.post("/", async (req, res) => {
  const allowSignUp = config.get("allowSignUp") as boolean;
  if (!allowSignUp)
    throw new NotAllowedToSignUpError("[401] Not allowed to sign up");
  const { body } = req;
  const userInDB = await User.findOne({ username: body.username });
  if (userInDB !== null)
    throw new ConflictError(`${body.username} conflicted.`);
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    tokenLastRevokedTime: Date.now(),
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.use(jwt(expressjwtOptions));

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.get("/:username", async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (user === null) {
    return next({
      code: 404,
      message: `[404] Not Found ${req.params.username}`,
    });
  }
  res.json(user);
});

usersRouter.put("/", async (req, res, next) => {
  const { body } = req;
  const user = await User.findById(req.user.id);
  if (user === null) {
    return next({ code: 404, message: `[404] Not Found ${req.user.username}` });
  }
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.oldPassword, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  let passwordHash: string;
  if (body.newPassword) {
    passwordHash = await bcrypt.hash(body.newPassword, saltRounds);
  } else {
    passwordHash = user.passwordHash;
  }
  const savedUser = await User.findByIdAndUpdate(req.user.id, {
    username: body.username ? body.username : user.name,
    name: body.name ? body.name : user.name,
    passwordHash,
    tokenLastRevokedTime: Date.now(),
  });
  res.json(savedUser);
});

usersRouter.delete("/", async (req, res, next) => {
  const password64 = req.query.paword;
  if (typeof password64 !== "string") {
    return next({ code: 400, message: "[400] invalid password" });
  }
  const userPassword = Base64.decode(password64);
  const user = await User.findOne({ username: req.user.username });
  if (user === null) {
    return next({ code: 404, message: `[404] Not Found ${req.user.username}` });
  }
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(userPassword, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  await Promise.all([
    User.findByIdAndDelete(req.user.id),
    Uper.deleteMany({ subscriber: req.user.id }),
    Video.deleteMany({ subscriber: req.user.id }),
  ]);
  res.status(204).end();
});

export default usersRouter;
