import { PrismaClient } from "../../generated/prisma/client";
import { ConversationItemData } from "../../types/conversation-type";

const prisma = new PrismaClient();
class RoomService {
  async getOrCreateConversation(myId: string, otherId: string) {
    let convo = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: { userId: { in: [myId, otherId] } },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!convo) {
      convo = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: myId }, { userId: otherId }],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatarUrl: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });
    }

    return { conversation: convo };
  }

  async getMyConversations(userId: string) {
    const items = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            lastMessage: {
              include: {
                sender: {
                  select: { id: true, username: true, fullName: true },
                },
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatarUrl: true,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: "desc" } },
    });

    const conversations: ConversationItemData[] = items.map((item) => {
      // Pick the "other" participant
      const other = item.conversation.participants
        .map((p) => p.user)
        .find((u) => u.id !== userId)!;

      return {
        id: item.conversation.id,
        user: {
          id: other.id,
          fullName: other.fullName || other.username || "Unknown",
          avatarUrl: other.avatarUrl,
          isActive: true,
        },
        lastMessage: item.conversation.lastMessage?.content ?? "",
        lastMessageTime:
          item.conversation.lastMessage?.createdAt.toISOString() ?? "",
        unreadCount: item.unreadCount,
      };
    });

    return { conversations };
  }
  async getMessages(
    conversationId: string,
    userId: string,
    { page = 1, pageSize = 50 },
  ) {
    const skip = (page - 1) * pageSize;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                isActive: true,
              },
            },
          },
        },
        messages: {
          skip,
          take: pageSize,
          include: {
            sender: {
              select: { id: true, username: true, fullName: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) throw new Error("Conversation not found");

    const other = conversation.participants.find(
      (p) => p.userId !== userId,
    )!.user;

    // reset unread counter
    await prisma.conversationParticipant.update({
      where: {
        userId_conversationId: { userId, conversationId },
      },
      data: { unreadCount: 0 },
    });

    return {
      id: conversation.id,
      user: other,
      messages: conversation.messages,
    };
  }
}

export default new RoomService();
