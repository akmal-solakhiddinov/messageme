import { Socket, Server } from "socket.io";
import logger from "../utils/logger";
import { EVENTS } from "./socketEvents";
import tokenService from "../features/tokens/token";
import { messageHandler } from "./handlers/message.handler";
import { roomHandler } from "./handlers/room.handler";
import { userHadler } from "./handlers/user.handler";

export function initializeSocketHandlers(io: Server) {
  logger.info("Initializing Socket.IO handlers...");

  io.on(EVENTS.CONNECTION.CONNECT, (socket: Socket) => {
    const rawCk = socket.handshake.headers.cookie?.split("=")[1].split(";")[0];

    if (!rawCk) {
      socket.disconnect();
      return;
    }

    const token = tokenService.verifyRefreshToken(rawCk);

    if (!token) {
      logger.warn("token is not defined");
      socket.disconnect();
      return;
    }

    socket.data.userId = token.id;
    socket.on("salom", (msg) => {
      logger.info(msg);

      socket.emit("salom", "qalay");
    });

    userHadler(socket);
    messageHandler(socket);
    roomHandler(socket);
  });
}
