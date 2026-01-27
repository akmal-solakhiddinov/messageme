import { PrismaClient } from "../../generated/prisma/client";
import { MessageUncheckedCreateInput } from "../../generated/prisma/models/Message";
import logger from "../../utils/logger";

const prisma = new PrismaClient();

class MessageService {
  async send(data: MessageUncheckedCreateInput) {
    try {
      const newMessage = await prisma.$transaction(async (tx) => {
        const msg = await tx.message.create({
          data,
        });

        await tx.conversation.update({
          where: { id: data.conversationId },
          data: {
            // This ensures the conversation jumps to the top of the chat list
            lastMessageId: msg.id,
            updatedAt: new Date(),
          },
        });

        return msg;
      });

      logger.info(`Message sent: ${newMessage.id}`);
      return newMessage;
    } catch (error) {
      logger.error("Error in MessageService.send:", error);
      throw error;
    }
  }

  async getMessages(conversationId: string) {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" }, // Ensure chronological order
      });

      return messages;
    } catch (error) {
      logger.error("Error in MessageService.getMessages:", error);
      throw error;
    }
  }

  async markAsRead(messageIds: string[]) {
    return await prisma.message.updateMany({
      where: { id: { in: messageIds } },
      data: { status: "seen" },
    });
  }
}

export default new MessageService();
