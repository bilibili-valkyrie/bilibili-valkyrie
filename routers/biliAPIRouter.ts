/* *********************************
基本是把bilibili的API进行一个去cors的暴露，以方便前端使用。
********************************* */

import express from "express";
import getUperInfo from "../api/getUperInfo";
import getUperSpace from "../api/getUperSpace";

const biliAPIRouter = express.Router();

require("express-async-errors");

biliAPIRouter.get("/getUperinfo:mid", async (req, res) => {
  const getUperInfoRes = await getUperInfo(req.params.mid);
  res.json(getUperInfoRes);
});

biliAPIRouter.get("/getUperSpace:mid", async (req, res) => {
  const pn = req.query.pn ? Number(req.query.pn) : undefined;
  const ps = req.query.ps ? Number(req.query.ps) : undefined;
  const getUperSpaceRes = await getUperSpace(req.params.mid, pn, ps);
  res.json(getUperSpaceRes);
});

export default biliAPIRouter;
