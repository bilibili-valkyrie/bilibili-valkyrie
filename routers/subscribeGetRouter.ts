/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import express from "express";
import NotFoundError from "../errors/NotFoundError";
import Uper from "../models/Uper";

require("express-async-errors");

const subscribeGetRouter = express.Router();

subscribeGetRouter.get("/getStatus/:id", async (req, res) => {
  const uperInDB = await Uper.findById(req.params.id).populate("videos");
  if (uperInDB === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  res.json(uperInDB);
});

subscribeGetRouter.get("/getAllStatus", async (req, res) => {
  const upersInDB = await Uper.find({ subscriber: req.user.id }).populate(
    "videos"
  );
  res.json(upersInDB);
});

export default subscribeGetRouter;
