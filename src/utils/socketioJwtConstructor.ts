import { AuthorizeOptions } from "@thream/socketio-jwt";
import config from "config";
import { UnauthorizedError } from "express-jwt";
import User from "../models/User";
import logger from "./logger";

const tokenChecker = async (payload: {
  username: string;
  id: string;
  iat: number;
}): Promise<null> => {
  const userInDB = await User.findById(payload.id);
  if (userInDB === null || userInDB.tokenLastRevokedTime > payload.iat) {
    logger.error(payload.id);
    throw new UnauthorizedError("revoked_token", {
      message: `[401] Unauthorized. Token was revoked`,
    });
  }
  return null;
};

const SECRET = config.get("jwtSecrets") as string;
const socketioJwtOptions: AuthorizeOptions = {
  secret: SECRET,
  algorithms: ["HS256"],
  onAuthentication: tokenChecker,
};

export default socketioJwtOptions;
