/* eslint-disable no-param-reassign */
import mongoose from "mongoose";

export interface UserAsJSON {
  subscribing: string[];
  username: string;
  name: string;
  tokenLastRevokedTime: number;
}

interface User {
  subscribing: string[];
  username: string;
  name: string;
  passwordHash: string;
  tokenLastRevokedTime: number;
}

type UserModel = mongoose.Model<User>;

const userSchema = new mongoose.Schema<User, UserModel>({
  subscribing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uper" }],
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  tokenLastRevokedTime: Number,
});

userSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.subscribing;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
