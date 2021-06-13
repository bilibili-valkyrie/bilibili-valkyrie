/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const errorHandler = (
  error: any,
  _request: any,
  response: any,
  next: any
): void => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.code === 11000) {
    return response.status(409).end();
  }

  next(error);
};

// 这是最后加载的中间件
export default errorHandler;
