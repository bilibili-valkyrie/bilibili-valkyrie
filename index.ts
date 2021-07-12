import http from "http";
import config from "config";
import app from "./app";
import logger from "./src/utils/logger";

const PORT = config.get("port");

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
