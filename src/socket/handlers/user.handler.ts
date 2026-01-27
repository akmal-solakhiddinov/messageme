import { Socket } from "socket.io";
import { EVENTS } from "../socketEvents";
import logger from "../../utils/logger";

export const userHadler = (socket: Socket) => {
  socket.on(EVENTS.USER.ONLINE, () => {
    socket.join(socket.data.userId);
    logger.info(`Client connected: [${socket.data.userId}]`);
  });
};
