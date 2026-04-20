import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  broker: string;
  accessToken: string;
  fyId: string;
  name: string;
  email: string;
  mobile: string;
  pan: string;
  xtsUserID?: string;
  tokenExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
    broker: String,
    accessToken: String,
    fyId: String,
    name: String,
    email: String,
    mobile: String,
    pan: String,
    xtsUserID: String,
    tokenExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);