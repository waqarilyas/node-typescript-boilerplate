import { Document, model, Schema, Types } from "mongoose";

interface ILike extends Document<Types.ObjectId> {
  tweet: any;
  user: any;
}

const likeSchema = new Schema<ILike>(
  {
    tweet: { type: Types.ObjectId, ref: "Tweet", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Like = model<ILike>("Like", likeSchema);

export default Like;
