import Wallet, { IWallet } from "../models/wallet.model";

const createUserWallet = async (payload: IWallet) => {
  return await Wallet.create(payload);
};

const getWalletByUserId = async (userId: string): Promise<IWallet> => {
  const wallet = await Wallet.findOne({ user: userId });
  //   if (!wallet) {
  //     throw new Error("Wallet not found");
  //   }
  return wallet;
};

const updateWalletById = async (
  walletId: string,
  updates: any
): Promise<IWallet> => {
  const updatedWallet = await Wallet.findByIdAndUpdate(
    walletId,
    { $set: updates },
    { new: true }
  );
  if (!updatedWallet) {
    throw new Error("Wallet not found");
  }
  return updatedWallet;
};

export { createUserWallet, getWalletByUserId, updateWalletById };
