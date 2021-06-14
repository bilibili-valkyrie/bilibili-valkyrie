/* eslint-disable consistent-return */

import logger from "../utils/logger";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const errorHandler = (
  error: any,
  _request: any,
  response: any,
  next: any
): void => {
  logger.error(error.message);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }

  switch (error.code) {
    case 10000:
      return response.status(409).end();
    case 404:
      return response.status(404).end();
    case 409:
      return response.status(409).end();
    default:
      break;
  }

  next(error);
};

// 这是最后加载的中间件
export default errorHandler;
