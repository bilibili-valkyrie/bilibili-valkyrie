/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { UperClass } from "./Uper";

class VideoClass {
  @prop()
  public comment?: number;

  @prop()
  public typeid?: number;

  @prop()
  public play?: number;

  @prop()
  public pic?: string;

  @prop()
  public subtitle?: string;

  @prop()
  public description?: string;

  @prop()
  public copyright?: string;

  @prop()
  public title?: string;

  @prop()
  public review?: number;

  @prop()
  public author?: string;

  @prop()
  public mid?: number;

  @prop()
  public created?: number;

  @prop()
  public length?: string;

  @prop()
  public video_review?: number;

  @prop()
  public aid?: number;

  @prop()
  public bvid?: string;

  @prop()
  public hide_click?: boolean;

  @prop()
  public is_pay?: number;

  @prop()
  public is_union_video?: number;

  @prop()
  public is_steins_gate?: number;

  @prop()
  public is_live_playback?: number;

  @prop({ ref: () => UperClass })
  public uper?: Ref<UperClass>;
}

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
