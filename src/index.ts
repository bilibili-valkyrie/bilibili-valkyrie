/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import { authorize } from "@thream/socketio-jwt";
import config from "config";
import { Server, Socket } from "socket.io";
import updateSubscribe from "./controllers/updateSubscribe";
import server from "./httpServer";
import Uper from "./models/Uper";
import logger from "./utils/logger";
import socketioJwtOptions from "./utils/socketioJwtConstructor";
import wait from "./utils/wait";

const PORT = config.get("port");

const io = new Server(server, {
  path: "/api/ws/",
});

io.use(authorize(socketioJwtOptions));

io.on("connection", (socket: Socket) => {
  socket.on("updateAllSubscribe", async () => {
    const upersInDB = await Uper.find({ subscriber: socket.decodedToken.id });
    let updateSum = 0;
    for await (const uperInDB of upersInDB) {
      const updateCount = await updateSubscribe(uperInDB);
      updateSum += updateCount;
      await wait(2000);
    }
    socket.emit("updateAllSubscribe", { updates: updateSum });
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
