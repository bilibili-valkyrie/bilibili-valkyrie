/* eslint-disable no-param-reassign */
import mongoose from "mongoose";
import { GetUperInfoResData } from "../api/getUperInfo";

interface Uper extends GetUperInfoResData {
  videos: string;
  mid: string;
  subscriber: string;
  lastUpdate: number;
}

type UperModel = mongoose.Model<Uper>;

const uperSchema = new mongoose.Schema<Uper, UperModel>({
  card: Object,
  lastUpdate: Number,
  following: Boolean,
  archive_count: Number,
  article_count: Number,
  follower: Number,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  mid: String,
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

uperSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.subscriber;
  },
});

const Uper = mongoose.model("Uper", uperSchema);

export default Uper;
