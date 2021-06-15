/* 名字是故意打成这样防止误打的 */
import mongoose from "mongoose";
import config from "config";
import Uper from "../models/Uper";
import Video from "../models/Video";

const databaseURL = config.get("dbConfig.URL") as string;

const rmDB = async () => {
  await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  await Uper.deleteMany();
  await Video.deleteMany();
  mongoose.connection.close();
};

rmDB();
