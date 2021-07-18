/* eslint-disable consistent-return */
import { getUnixTime } from "date-fns";
import express from "express";
import getUperSpace from "../api/getUperSpace";
import addVideos from "../controllers/addVideos";
import trimVideos from "../controllers/trimVideos";
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
  await trimVideos(uperInDB);
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
  const getUperSpaceRes = await getUperSpace(uperInDB.mid);
  await addVideos(getUperSpaceRes.list.vlist, uperInDB);
  await uperInDB.save();
  res.json(uperInDB);
});

subscribeUpdateRouter.get("/getUpdate/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  const newVideos = await Video.find({ uper: req.params.id });
  res.json(newVideos);
});

subscribeUpdateRouter.get("/getAllUpdate", async (req, res) => {
  const newVideos = await Video.find({ subscriber: req.user.id });
  res.json(newVideos);
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
