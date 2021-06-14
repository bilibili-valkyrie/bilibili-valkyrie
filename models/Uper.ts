/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";

const uperSchema = new mongoose.Schema({
  _id: String,
  card: Object,
  lastUpdate: Number,
  following: Boolean,
  archive_count: Number,
  article_count: Number,
  follower: Number,
  videos: [{ type: Number, ref: "Video" }],
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
