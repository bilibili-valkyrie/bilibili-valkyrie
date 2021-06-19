/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import config from "config";
import { UnauthorizedError } from "express-jwt";
import User from "../models/User";
import logger from "./logger";

const tokenChecker = async (
  _req: any,
  payload: { username: string; id: string; iat: number },
  done: any
) => {
  const userInDB = await User.findById(payload.id);
  if (userInDB === null) {
    logger.error(payload.id);
    return done(
      new UnauthorizedError("revoked_token", {
        message: `[401] Unauthorized. Token was revoked`,
      }),
      true
    );
  }
  return done(null, false);
};

const SECRET = config.get("jwtSecrets") as string;
const expressjwtOptions = {
  secret: SECRET,
  algorithms: ["HS256"],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
