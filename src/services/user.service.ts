import * as httpStatus from "http-status";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  } else if (await User.isUsernameTaken(userBody.userName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "userName already taken");
  }
  const usr = await User.create(userBody);
  return usr.toObject();
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).lean();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByAddress = async (address) => {
  return User.findOne({ address }).lean();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
  }).lean();

  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await User.deleteOne({ _id: userId });
  return "user deleted successfully";
};

const searchUsersByName = async (keyword, page, perPage) => {
  return await User.find({ userName: { $regex: keyword, $options: "i" } })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

export {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByAddress,
  searchUsersByName,
};
