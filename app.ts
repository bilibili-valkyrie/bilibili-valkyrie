/* eslint-disable consistent-return */
import config from "config";
import { getUnixTime } from "date-fns";
import express from "express";
import mongoose from "mongoose";
import getUperInfo from "./api/getUperInfo";
import getUserSpace from "./api/getUserSpace";
import addVideos from "./controllers/addVideos";
import errorHandler from "./middlewares/errorHandler";
import Uper from "./models/Uper";
import Video from "./models/Video";
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
    lastUpdate: getUnixTime(Date.now()),
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
  uperInDB.lastUpdate = getUnixTime(Date.now());
  await uperInDB.save();
  res.json(uperInDB);
});

app.get("/api/getUpdate/:mid", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.mid);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.mid}` });
  }
  const newVideos = await Video.find()
    .where("uper", req.params.mid)
    .gte("created", uperInDB.lastUpdate);
  res.json(newVideos);
});

app.delete("/api/delSubScribe/:mid", async (req, res) => {
  await Uper.findByIdAndDelete(req.params.mid);
  await Video.deleteMany({ uper: req.params.mid });
  res.status(204).end();
});

app.use(errorHandler);

export default app;
