import * as Joi from "joi";
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    age: Joi.number().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(4).required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
