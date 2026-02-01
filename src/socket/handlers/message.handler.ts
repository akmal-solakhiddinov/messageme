// message.handler.ts
import { Socket, Server } from "socket.io";
import { EVENTS } from "../socketEvents";
import logger from "../../utils/logger";
import messageService from "../../features/message/message.service";
import { debounce } from "../../utils/debounce";


type SeenPayload = { messageId: string };
type SeenAck = (ok: boolean) => void;


export const messageHandler = (socket: Socket, io: Server) => {
  /**
   * SEND MESSAGE
   */
  socket.on(
    EVENTS.MESSAGE.SEND,
    async (
      payload: { content: string; conversationId: string },
      ack: (ok: boolean, message?: any) => void,
    ) => {
      try {
        const result = await messageService.send({
          senderId: socket.data.userId,
          ...payload,
        });

        ack(true, result.message);

        socket
          .to(`conversation:${payload.conversationId}`)
          .emit(EVENTS.MESSAGE.NEW, result.message);

        for (const participant of result.conversation.participants) {
          io.to(`user:${participant.userId}`).emit("conversation:updated", {
            id: result.conversation.id,
            lastMessage: result.message.content,
            unreadCount: participant.unreadCount,
            createdAt: result.message.createdAt,
          });
        }
      } catch (err) {
        logger.error(err);
        ack(false);
      }
    },
  );
/**
 * MESSAGE SEEN
 */
const seenMessageIds = new Set<string>();

const flushSeenMessages = debounce(async () => {
  try {
    const ids = Array.from(seenMessageIds);
    if (ids.length === 0) return;

    seenMessageIds.clear();

    const seenMessages = await messageService.markAsRead(ids);
    logger.info(seenMessages);

    // notify senders
    const bySender = new Map<string, string[]>();

    for (const m of seenMessages) {
      if (!bySender.has(m.senderId)) {
        bySender.set(m.senderId, []);
      }
      bySender.get(m.senderId)!.push(m.id);
    }

    for (const [senderId, messageIds] of bySender) {
      io.to(`user:${senderId}`).emit("message:seen:update", {
        messageIds,
        conversationId: seenMessages[0].conversationId,
      });
    }
  } catch (err) {
    logger.error(err);
  }
}, 2000);

socket.on(
  EVENTS.MESSAGE.SEEN,
  (payload: SeenPayload, ack: SeenAck) => {
    seenMessageIds.add(payload.messageId);

    // ✅ ACK immediately (never debounce ACK)
    ack(true);

    // debounce DB flush
    flushSeenMessages();
  },
);




socket.on("disconnect", () => {
  seenMessageIds.clear();
});
}
