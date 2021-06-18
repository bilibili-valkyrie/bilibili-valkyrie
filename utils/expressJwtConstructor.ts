import config from "config";

const SECRET = config.get("jwtSecrets") as string;
const expressjwtOptions = {
  secret: SECRET,
  algorithms: ["HS256"],
};

export default expressjwtOptions;
