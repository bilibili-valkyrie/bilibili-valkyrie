import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import bcrypt from "bcryptjs";
import express from "express";
import config from "config";
import User from "../models/User";
import expressjwtOptions from "../utils/expressJwtConstructor";

require("express-async-errors");

const SECRET = config.get("jwtSecrets") as string;
const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { body } = req;

  const user = (await User.findOne({
    username: body.username,
  })) as unknown as any;
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    iat: Date.now(),
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

loginRouter.use(expressJwt(expressjwtOptions));

loginRouter.get("/revokeToken", async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    tokenLastRevokedTime: Date.now(),
  });
  res.status(200).end();
});

export default loginRouter;
