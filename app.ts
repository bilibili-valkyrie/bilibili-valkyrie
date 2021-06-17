/* eslint-disable consistent-return */
import config from "config";
import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler";
import Uper from "./models/Uper";
import loginRouter from "./routers/loginRouter";
import subscribeAddRemoveRouter from "./routers/subscribeAddRemoveRouter";
import subscribeUpdateRouter from "./routers/subscribeUpdateRouter";
import usersRouter from "./routers/usersRouter";
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

app.get("/api/getStatus/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id).populate("videos");
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  res.json(uperInDB);
});

app.get("/api/getAllStatus", async (_req, res) => {
  const upersInDB = await Uper.find().populate("videos");
  res.json(upersInDB);
});

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/subU", subscribeUpdateRouter);
app.use("/api/subAR", subscribeAddRemoveRouter);

app.use(errorHandler);

export default app;
