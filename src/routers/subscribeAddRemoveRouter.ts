/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import { getUnixTime } from "date-fns";
import express from "express";
import getUperInfo from "../api/getUperInfo";
import getUperSpace from "../api/getUperSpace";
import addVideos from "../controllers/addVideos";
import deleteSubscribe from "../controllers/deleteSubscribe";
import ConflictError from "../errors/ConflictError";
import InvalidMidError from "../errors/InvalidMidError";
import Uper from "../models/Uper";
import User from "../models/User";

require("express-async-errors");

const subscribeAddRemoveRouter = express.Router();

subscribeAddRemoveRouter.get("/addSubscribe/:mid", async (req, res) => {
  const uperInDB = await Uper.findOne({
    mid: req.params.mid,
    subscriber: req.user.id,
  });
  const userInDB = await User.findById(req.user.id);
  if (uperInDB !== null) {
    throw new ConflictError(`[409] Conflict ${req.params.mid}`);
  }
  if (Number.isNaN(Number(req.params.mid)))
    throw new InvalidMidError({ message: `${req.params.mid} is not valid.` });
  const getUperInfoRes = await getUperInfo(req.params.mid);
  const fmtedRes1 = {
    ...getUperInfoRes.data,
    mid: getUperInfoRes.data.card.mid,
    subscriber: req.user.id,
    lastUpdate: getUnixTime(Date.now()),
  };
  const newUper = new Uper(fmtedRes1);
  const getUperSpaceRes = await getUperSpace(req.params.mid);
  await newUper.save();
  const dbRes2 = await addVideos(getUperSpaceRes.list.vlist, newUper);
  /* use ! to remove null type. */
  userInDB!.subscribing = userInDB!.subscribing.concat(newUper._id);
  await userInDB?.save();
  res.status(201).json(dbRes2);
});

subscribeAddRemoveRouter.delete("/delSubscribe/:id", async (req, res) => {
  await deleteSubscribe(req.params.id, res);
  res.status(204).end();
});

export default subscribeAddRemoveRouter;
