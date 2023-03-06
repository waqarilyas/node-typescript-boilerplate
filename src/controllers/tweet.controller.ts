import * as httpStatus from "http-status";
import Tweet from "../models/tweet.model";
import { IUser } from "../models/user.model";
import {
  deleteTweetbyId,
  getTweetById,
  getUserTweets,
  likeTweet,
  saveMultipleTweets,
  saveTweet,
  unlikeTweet,
  updateTweetMessageById,
} from "../services/tweet.service";
import catchAsync from "../utils/catchAsync";

const createTweet = catchAsync(async (req, res) => {
  const {
    user,
    body,
  }: { user: IUser; body: { message: string; id: number }[] } = req;

  const sortedTweets = body.sort((a, b) => a.id - b.id);

  const IS_THREAD = body.length > 1;

  const savePayload = {
    message: sortedTweets[0].message,
    user: user._id,
    isThread: IS_THREAD,
    isParent: IS_THREAD ? true : false,
  };
  const parentTweet = await saveTweet(savePayload);

  if (IS_THREAD) {
    const threads = sortedTweets.splice(0, 1).map((tweet, index) => {
      return {
        message: tweet.message,
        user: user._id,
        isThread: true,
        isParent: false,
        tweetIndex: index + 1,
        parentTweet: parentTweet._id,
      };
    });

    await saveMultipleTweets(threads);
  }

  res.status(httpStatus.OK).send({ message: "tweet created successfully" });
});

const getTweet = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ message: "success" });
});

const getUserTweet = catchAsync(async (req, res) => {
  const user = req.user;
  const tweets = await getUserTweets(user._id);
  res.status(httpStatus.OK).send({ message: "success", tweets });
});

const deleteTweet = catchAsync(async (req, res) => {
  const tweetId = req.params.id;

  const user = req.user;

  if (!tweetId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "tweet id is required" });
  }

  const tweet = await getTweetById(tweetId);

  if (!tweet) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "Tweet not found" });
  } else {
    if (tweet.user.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    } else {
      await deleteTweetbyId(tweetId);
      return res
        .status(httpStatus.OK)
        .send({ message: "Tweet deleted successfully" });
    }
  }
});

const updateTweet = catchAsync(async (req, res) => {
  const tweetId = req.params.id;

  const { message } = req.body;

  const user = req.user;

  if (!tweetId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "tweet id is required" });
  }

  const tweet = await getTweetById(tweetId);

  if (!tweet) {
    res.status(httpStatus.NOT_FOUND).send({ message: "Tweet not found" });
  } else {
    if (tweet.user.toString() !== user._id.toString()) {
      res.status(httpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
    } else {
      await updateTweetMessageById(tweetId, message);
      res.status(httpStatus.OK).send({ message: "Tweet updated successfully" });
    }
  }
});

const handleTweetLikeStatus = catchAsync(async (req, res) => {
  const tweetId = req.params.id;
  const { like } = req.body;
  const user = req.user;

  if (!tweetId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "tweet id is required" });
  }

  const tweet = await getTweetById(tweetId);

  if (!tweet) {
    res.status(httpStatus.NOT_FOUND).send({ message: "Tweet not found" });
  } else {
    if (tweet.user.toString() !== user._id.toString()) {
      res.status(httpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
    } else {
      if (like) {
        await likeTweet(String(tweet._id), String(user._id));
      } else {
        await unlikeTweet(String(tweet._id));
      }
      res.status(httpStatus.OK).send({ message: "Tweet updated successfully" });
    }
  }
});

const getUserFeed = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = req.user._id;

  const tweets = await Tweet.aggregate([
    {
      $match: {
        user: { $ne: currentUser },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { tweetId: "$_id", userId: currentUser },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$tweet", "$$tweetId"] },
                  { $eq: ["$user", "$$userId"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ],
        as: "isLikedByCurrentUser",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
        isLikedByCurrentUser: {
          $cond: {
            if: { $gt: [{ $size: "$isLikedByCurrentUser" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await Tweet.countDocuments({ user: { $ne: currentUser } });

  res.status(httpStatus.OK).send({ data: tweets, total, page });
});

export {
  createTweet,
  getTweet,
  deleteTweet,
  getUserTweet,
  updateTweet,
  handleTweetLikeStatus,
  getUserFeed,
};
