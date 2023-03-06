import * as Joi from "joi";

const tweet = Joi.object({
  message: Joi.string().required(),
  id: Joi.number().integer().min(0).required(),
});

const tweetUpdate = {
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

const likeTweet = {
  body: Joi.object().keys({
    like: Joi.boolean().required(),
  }),
};

const createTweet = {
  body: Joi.array().items(tweet).min(1).required(),
};

export { createTweet, tweet, tweetUpdate, likeTweet };
