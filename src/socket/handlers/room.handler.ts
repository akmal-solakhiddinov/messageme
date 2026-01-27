import { Socket } from "socket.io";
import { EVENTS } from "../socketEvents";
import logger from "../../utils/logger";

export const roomHandler = (socket: Socket) => {
  socket.on(EVENTS.ROOM.JOIN, ({ conversationId }) => {
    if (socket.data.activeConversationId) {
      socket.leave(socket.data.activeConversationId);
      logger.info(
        `user: [${socket.data.userId}] leaving conversation: [ ${socket.data.activeConversationId} ]`,
      );
    }

    socket.join(`conversation:${conversationId}`);
    logger.info(`USER: [${socket.data.userId}] 
Joining room: [
${conversationId} ]`);
    socket.data.activeConversationId = conversationId;
  });
};
