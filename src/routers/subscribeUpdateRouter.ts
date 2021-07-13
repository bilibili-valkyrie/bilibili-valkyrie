/* eslint-disable consistent-return */
import { getUnixTime } from "date-fns";
import express from "express";
import lodash from "lodash";
import updateSubscribe from "../controllers/updateSubscribe";
import NotFoundError from "../errors/NotFoundError";
import Uper from "../models/Uper";
import Video from "../models/Video";

require("express-async-errors");

const subscribeUpdateRouter = express.Router();

subscribeUpdateRouter.put("/markSubscribeRead/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  uperInDB.lastUpdate = getUnixTime(Date.now());
  await uperInDB.save();
  res.json(uperInDB);
});

subscribeUpdateRouter.put("/changeSubscribeReadTime/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  uperInDB.lastUpdate = req.body.lastUpdateUnix
    ? req.body.lastUpdateUnix
    : getUnixTime(req.body.lastUpdateJS);
  await uperInDB.save();
  res.json(uperInDB);
});

subscribeUpdateRouter.get("/getUpdate/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  const newVideos = await Video.find()
    .where("uper", req.params.id)
    .gte("created", uperInDB.lastUpdate);
  res.json(newVideos);
});

subscribeUpdateRouter.get("/getAllUpdate", async (req, res) => {
  const upersInDB = await Uper.find({ subscriber: req.user.id });
  const videosPAry = upersInDB.map(async (uperInDB) => {
    const newVideos = await Video.find()
      .where("uper", uperInDB._id)
      .gte("created", uperInDB.lastUpdate);
    return newVideos;
  });
  const videosAry2 = await Promise.all(videosPAry);
  const videosAry1 = lodash.flattenDeep(videosAry2);
  res.json(videosAry1);
});

subscribeUpdateRouter.get("/updateVideos/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  const updateCount = await updateSubscribe(uperInDB);
  res.json({ updates: updateCount });
});

export default subscribeUpdateRouter;
