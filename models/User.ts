/* eslint-disable no-param-reassign */
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface UserAsJSON {
  subscribing: string[];
  username: string;
  name: string;
  tokenRevoked: boolean;
}

const userSchema = new mongoose.Schema({
  subscribing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uper" }],
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  tokenRevoked: Boolean,
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
