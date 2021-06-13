import express from "express";
import getUserInfo from "./api/getUserInfo";
import errorHandler from "./middlewares/errorHandler";
import User from "./services/userStatCacheService";

require("express-async-errors");

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/api/getStatus/:mid", async (req, res) => {
  const userInDB = await User.findById(req.params.mid);
  if (userInDB === null) {
    res.status(404).end();
  } else {
    res.json(userInDB);
  }
});

app.get("/api/getAllStatus", async (_req, res) => {
  const usersInDB = await User.find();
  res.json(usersInDB);
});

app.get("/api/addSubScribe/:mid", async (req, res) => {
  const getUserInfoRes = await getUserInfo(req.params.mid);
  const fmtedRes1 = {
    ...getUserInfoRes.data,
    _id: getUserInfoRes.data.card.mid,
  };
  const newUser = new User(fmtedRes1);
  const dbRes = await newUser.save();
  res.json(dbRes);
});

app.delete("/api/delSubScribe/:mid", (req, res) => {
  User.findByIdAndDelete(req.params.mid);
  res.status(204).end();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
