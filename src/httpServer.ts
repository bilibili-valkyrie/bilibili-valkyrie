import http from "http";
import app from "./expressApp";

const server = http.createServer(app);

export default server;
