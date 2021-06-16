/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  subscribing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uper" }],
  username: String,
  passwordHash: String,
});

userSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
