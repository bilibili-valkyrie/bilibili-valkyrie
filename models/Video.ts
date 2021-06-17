/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  uper: { type: mongoose.Schema.Types.ObjectId, ref: "Uper" },
  comment: Number,
  typeid: Number,
  play: Number,
  pic: String,
  subtitle: String,
  description: String,
  copyright: String,
  title: String,
  review: Number,
  author: String,
  mid: Number,
  created: Number,
  length: String,
  video_review: Number,
  aid: Number,
  bvid: String,
  hide_click: Boolean,
  is_pay: Number,
  is_union_video: Number,
  is_steins_gate: Number,
  is_live_playback: Number,
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

videoSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
