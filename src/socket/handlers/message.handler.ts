import { Socket } from "socket.io";
import { EVENTS } from "../socketEvents";
import logger from "../../utils/logger";
import messageService from "../../features/message/message.service";

export const messageHandler = (socket: Socket) => {
  socket.on(EVENTS.MESSAGE.SEND, async (msg, cb) => {
    try {
      logger.info(msg, "new Message");

      // Save message + update conversation safely
      const newMsg = await messageService.send({
        senderId: socket.data.userId,
        ...msg,
      });

      // ACK client only after successful DB save
      cb(true, newMsg);

      // Broadcast to other users in the conversation
      socket.broadcast
        .to(`conversation:${msg.conversationId}`)
        .emit(EVENTS.MESSAGE.NEW, newMsg);
    } catch (err: any) {
      logger.error(err, "Error sending message");
      // ACK failure
      cb(false, { error: "Message not sent. Retry." });
    }
  });
};
