/* eslint-disable consistent-return */
import { getUnixTime } from "date-fns";
import express from "express";
import Uper from "../models/Uper";
import Video from "../models/Video";

const subscribeUpdateRouter = express.Router();

subscribeUpdateRouter.put("/markSubscribeRead/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  uperInDB.lastUpdate = getUnixTime(Date.now());
  await uperInDB.save();
  res.json(uperInDB);
});

subscribeUpdateRouter.put(
  "/changeSubscribeReadTime/:id",
  async (req, res, next) => {
    const uperInDB = await Uper.findById(req.params.id);
    if (uperInDB === null) {
      return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
    }
    uperInDB.lastUpdate = req.body.lastUpdateUnix
      ? req.body.lastUpdateUnix
      : getUnixTime(req.body.lastUpdateJS);
    await uperInDB.save();
    res.json(uperInDB);
  }
);

subscribeUpdateRouter.get("/getUpdate/:id", async (req, res, next) => {
  const uperInDB = await Uper.findById(req.params.id);
  if (uperInDB === null) {
    return next({ code: 404, message: `[404] Not Found ${req.params.id}` });
  }
  const newVideos = await Video.find()
    .where("uper", req.params.id)
    .gte("created", uperInDB.lastUpdate);
  res.json(newVideos);
});

export default subscribeUpdateRouter;
