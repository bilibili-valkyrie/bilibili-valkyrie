/* eslint-disable no-param-reassign */
import { getModelForClass, plugin, prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { UperClass } from "./Uper";

export interface UserAsJSON {
  subscribing: string[];
  username: string;
  name: string;
  tokenLastRevokedTime: number;
}

export class UserClass {
  @prop({ type: () => UperClass })
  public subscribing?: Ref<UperClass>[];

  @prop({ unique: true })
  public username?: string;

  @prop()
  public name?: string;

  @prop()
  public passwordHash?: string;
}

const userSchema = new mongoose.Schema({
  subscribing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uper" }],
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  tokenLastRevokedTime: Number,
});

userSchema.plugin(uniqueValidator);

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
