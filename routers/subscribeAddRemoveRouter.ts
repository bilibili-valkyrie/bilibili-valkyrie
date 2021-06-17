/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import express from "express";
import addSubscribe from "../controllers/addSubscribe";
import deleteSubscribe from "../controllers/deleteSubscribe";

require("express-async-errors");

const subscribeAddRemoveRouter = express.Router();

subscribeAddRemoveRouter.get("/addSubscribe/:mid", async (req, res, next) => {
  addSubscribe(req.params.mid, res, next);
});

subscribeAddRemoveRouter.delete("/delSubscribe/:id", async (req, res) => {
  await deleteSubscribe(req.params.id, res);
  res.status(204).end();
});

export default subscribeAddRemoveRouter;
