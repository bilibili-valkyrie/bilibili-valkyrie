/* eslint-disable consistent-return */
import config from "config";
import express from "express";
import jwt from "express-jwt";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler";
import loginRouter from "./routers/loginRouter";
import subscribeAddRemoveRouter from "./routers/subscribeAddRemoveRouter";
import subscribeGetRouter from "./routers/subscribeGetRouter";
import subscribeUpdateRouter from "./routers/subscribeUpdateRouter";
import usersRouter from "./routers/usersRouter";
import expressjwtOptions from "./utils/expressJwtConstructor";
import logger from "./utils/logger";

const databaseURL = config.get("dbConfig.URL") as string;

require("express-async-errors");

mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(jwt(expressjwtOptions));
app.use("/api/sub", subscribeGetRouter);
app.use("/api/sub", subscribeUpdateRouter);
app.use("/api/sub", subscribeAddRemoveRouter);

app.use(errorHandler);

export default app;
