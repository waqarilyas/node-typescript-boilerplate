import { Document, Types, Schema, model } from "mongoose";

export interface IWallet {
  _id?: string;
  user: any;
  balance?: number;
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Wallet = model<IWallet>("Wallet", walletSchema);

export default Wallet;
