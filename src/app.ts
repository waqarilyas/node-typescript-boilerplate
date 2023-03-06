import httpStatus from "http-status";
import ApiError from "./utils/ApiError";
// ES6 import syntax
import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import {
  successHandler,
  errorHandler as morganErrorHandler,
} from "./config/morgan";
import { jwtStrategy } from "./config/passport";
import { authLimiter } from "./middlewares/rateLimiter";
import { errorConverter, errorHandler } from "./middlewares/error";
import { fileParser } from "express-multipart-file-parser";
import routes from "./routes/v1";

const app = express();

app.use(successHandler);
app.use(morganErrorHandler);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  fileParser({
    rawBodyOptions: {
      limit: "30mb",
    },
    busboyOptions: {
      limits: {
        fields: 50,
      },
    },
  })
);

app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === "production") {
//   app.use("/v1/auth", authLimiter);
// }

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req: any, res: any, next: any) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// module.exports = app;
export { app };
