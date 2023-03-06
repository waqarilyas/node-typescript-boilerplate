import * as httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { createUser, getUserByEmail } from "../services/user.service";
import { generateAuthTokens, removeToken } from "../services/token.service";

const register = catchAsync(async (req, res) => {
  const user = await createUser(req.body);
  const token = await generateAuthTokens(user);

  res
    .status(httpStatus.OK)
    .send({ message: "user created successfully", user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Invalid credentials",
    });
  }

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: "Invalid credentials",
    });
  }

  const token = await generateAuthTokens(user);
  res.status(httpStatus.OK).send({ message: "login successful", user, token });
});

const logout = catchAsync(async (req, res) => {
  const user = req.user;
  await removeToken(user);
  res.status(httpStatus.OK).send({
    message: "logout successful",
    status: true,
  });
});

export { register, login, logout };
