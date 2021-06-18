/* eslint-disable consistent-return */

import logger from "../utils/logger";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const errorHandler = (
  error: any,
  _request: any,
  response: any,
  next: any
): void => {
  logger.error(error);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "InvalidMidError") {
    return response.status(400).send(error.message).end();
  }
  if (error.errors && error.errors.username.kind === "unique")
    return response.status(409).end();

  switch (error.code) {
    case 10000:
      return response.status(409).end();
    case 404:
      return response.status(404).end();
    case 409:
      return response.status(409).end();
    case 400:
      return response.status(400).send(error.message).end();
    case "revoked_token":
      return response.status(401).send(error.inner.message).end();
    default:
      break;
  }

  next(error);
};

// 这是最后加载的中间件
export default errorHandler;
