import { PrismaClient } from "../../generated/prisma/client";
import { MessageUncheckedCreateInput } from "../../generated/prisma/models/Message";
import logger from "../../utils/logger";

const prisma = new PrismaClient();

class MessageService {
  async send(data: MessageUncheckedCreateInput) {
    try {
      const newMessage = await prisma.$transaction(async (tx) => {
        const msg = await tx.message.create({ data });

        const conv = await tx.conversation.update({
          where: { id: data.conversationId },
          data: {
            lastMessageId: msg.id,
            updatedAt: new Date(),
          },
          include: {
            participants: { include: { user: true } },
            lastMessage: true,
          },
        });

        return { message: msg, conversation: conv };
      });

      const { message, conversation } = newMessage;

      logger.info(`Message sent: ${message.id}`);

      return newMessage;
    } catch (error) {
      logger.error("Error in MessageService.send:", error);
      throw error;
    }
  }

  async getMessages(conversationId: string, myUserId: string) {
    try {
      const [messages, participant] = await prisma.$transaction([
        prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        }),
        prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            NOT: { userId: myUserId },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                isActive: true,
                email: true,
              },
            },
          },
        }),
      ]);

      return {
        user: participant?.user ?? null,
        messages,
      };
    } catch (error) {
      logger.error("Error in MessageService.getMessages:", error);
      throw error;
    }
  }

  async markAsRead(messageIds: string[]) {
    return prisma.$transaction(async (tx) => {
      // 1️⃣ get only unseen messages
      const messages = await tx.message.findMany({
        where: {
          id: { in: messageIds },
          status: { not: "seen" },
        },
        select: {
          id: true,
          senderId: true,
          conversationId: true,
        },
      });

      if (messages.length === 0) {
        return [];
      }

      // 2️⃣ update only those messages
      await tx.message.updateMany({
        where: {
          id: { in: messages.map((m) => m.id) },
        },
        data: { status: "seen" },
      });

      // 3️⃣ return affected messages
      return messages;
    });
  }
}

export default new MessageService();
