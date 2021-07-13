import { Server, Socket } from "socket.io";
import config from "config";
import { authorize } from "@thream/socketio-jwt";
import server from "./httpServer";
import Uper from "./models/Uper";
import logger from "./utils/logger";
import socketioJwtOptions from "./utils/socketioJwtConstructor";

const PORT = config.get("port");

const io = new Server(server, {
  path: "/api/ws/",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use(authorize(socketioJwtOptions));

io.on("connection", (socket: Socket) => {
  console.log(socket.decodedToken);
  console.log("connected");
  socket.on("updateAllSubscribe", async () => {
    console.log("queried");
    const upersInDB = await Uper.find({});
    socket.emit("updateAllSubscribe", upersInDB);
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
