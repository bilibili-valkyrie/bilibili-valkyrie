/* eslint-disable no-param-reassign */
import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class UperClass {
  @prop()
  public card?: {
    mid: string;
    name: string;
    approve: boolean;
    sex: string;
    rank: string;
    face: string;
    DisplayRank: string;
    regtime: number;
    spacesta: number;
    birthday: string;
    place: string;
    description: string;
    article: number;
    attentions: unknown[];
    fans: number;
    friend: number;
    attention: number;
    sign: string;
    level_info: {
      current_level: number;
      current_min: number;
      current_exp: number;
      next_exp: number;
    };
    pendant: {
      pid: number;
      name: string;
      image: string;
      expire: number;
      image_enhance: string;
      image_enhance_frame: string;
    };
    nameplate: {
      nid: number;
      name: string;
      image: string;
      image_small: string;
      level: string;
      condition: string;
    };
    Official: {
      role: number;
      title: string;
      desc: string;
      type: number;
    };
    official_verify: {
      type: number;
      desc: string;
    };
    vip: {
      type: number;
      status: number;
      due_date: number;
      vip_pay_type: number;
      theme_type: number;
      label: {
        path: string;
        text: string;
        label_theme: string;
        text_color: string;
        bg_style: number;
        bg_color: string;
        border_color: string;
      };
      avatar_subscript: number;
      nickname_color: string;
      role: number;
      avatar_subscript_url: string;
      vipType: number;
      vipStatus: number;
    };
  };

  @prop()
  public lastUpdate?: number;

  @prop()
  public following?: boolean;

  @prop()
  public archive_count?: number;

  @prop()
  public follower?: number;
}

const uperSchema = new mongoose.Schema({
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
  },
});

const Uper = mongoose.model("Uper", uperSchema);

export default Uper;
