import { Document, model, Schema, Types } from "mongoose";

export interface ITweet {
  message: string;
  user: any;
  parentTweet?: any;
  isThread: boolean;
  isParent: boolean;
  tweetIndex?: number;
}

const tweetSchema = new Schema<ITweet>(
  {
    message: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    parentTweet: { type: Types.ObjectId, ref: "Tweet", default: null },
    isThread: { type: Boolean, required: true, default: false },
    isParent: { type: Boolean, required: true, default: true },
    tweetIndex: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

const Tweet = model<ITweet>("Tweet", tweetSchema);

export default Tweet;
