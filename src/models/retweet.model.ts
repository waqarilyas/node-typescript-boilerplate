import { Document, model, Schema } from "mongoose";

interface IReTweet extends Document {
  tweet: any;
  user: any;
}

const reTweetSchema = new Schema<IReTweet>(
  {
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ReTweet = model<IReTweet>("ReTweet", reTweetSchema);

export default ReTweet;
