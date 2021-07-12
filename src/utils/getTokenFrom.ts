/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getTokenFrom = (request: any) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

export default getTokenFrom;
