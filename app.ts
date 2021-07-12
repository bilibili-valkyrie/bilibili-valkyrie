/* eslint-disable consistent-return */
import config from "config";
import cors from "cors";
import express from "express";
import jwt from "express-jwt";
import mongoose from "mongoose";
import morgan from "morgan";
import errorHandler from "./src/middlewares/errorHandler";
import biliAPIRouter from "./src/routers/biliAPIRouter";
import loginRouter from "./src/routers/loginRouter";
import subscribeAddRemoveRouter from "./src/routers/subscribeAddRemoveRouter";
import subscribeGetRouter from "./src/routers/subscribeGetRouter";
import subscribeUpdateRouter from "./src/routers/subscribeUpdateRouter";
import usersRouter from "./src/routers/usersRouter";
import expressjwtOptions from "./src/utils/expressJwtConstructor";
import logger from "./src/utils/logger";

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

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(jwt(expressjwtOptions));
app.use("/api/bili", biliAPIRouter);
app.use("/api/sub", subscribeGetRouter);
app.use("/api/sub", subscribeUpdateRouter);
app.use("/api/sub", subscribeAddRemoveRouter);

app.use(errorHandler);

export default app;
