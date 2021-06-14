/* eslint-disable consistent-return */
import express from "express";
import config from "config";
import mongoose from "mongoose";
import getUperInfo from "./api/getUperInfo";
import errorHandler from "./middlewares/errorHandler";
import Uper from "./models/Uper";
import getUserSpace from "./api/getUserSpace";
import logger from "./utils/logger";
import addVideos from "./controllers/addVideos";

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

app.get("/api/getStatus/:mid", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.mid).populate("videos");
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.mid}` });
  }
  res.json(uperInDB);
});

app.get("/api/getAllStatus", async (_req, res) => {
  const upersInDB = await Uper.find().populate("videos");
  res.json(upersInDB);
});

app.get("/api/addSubScribe/:mid", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.mid);
  if (uperInDB !== null) {
    return next({ code: 409, message: `[409] Conflict ${req.params.mid}` });
  }
  const getUperInfoRes = await getUperInfo(req.params.mid);
  const fmtedRes1 = {
    ...getUperInfoRes.data,
    _id: getUperInfoRes.data.card.mid,
    lastUpdate: Date.now(),
  };
  const newUper = new Uper(fmtedRes1);
  const getUserSpaceRes = await getUserSpace(req.params.mid);
  await addVideos(getUserSpaceRes.list.vlist, newUper);
  const dbRes = await newUper.save();
  res.json(dbRes);
});

app.put("/api/markSubScribeRead/:mid", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.mid);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.mid}` });
  }
  uperInDB.lastUpdate = Date.now();
  await uperInDB.save();
  res.json(uperInDB);
});

app.delete("/api/delSubScribe/:mid", async (req, res) => {
  await Uper.findByIdAndDelete(req.params.mid);
  res.status(204).end();
});

app.use(errorHandler);

export default app;
