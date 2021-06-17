import config from "config";

const SECRET = config.get("jwtSecrets") as string;
const expressjwtOptions = {
  secret: SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
};

export default expressjwtOptions;
