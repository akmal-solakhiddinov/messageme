import { PrismaClient } from "../../generated/prisma/client";
import { UserSearchResult } from "../../types/user-types";

const prisma = new PrismaClient();

class UserService {
  async profile(userId: string) {
    // console.log(userId, '<use rid');
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      return { user: { ...user } };
    } catch (error: any) {
      throw new Error(
        `Error retrieving profile for user ID ${userId}: ${error.message}`,
      );
    }
  }

  async update(userId: string, updatedFields: any) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updatedFields,
      });

      if (!user) {
        throw new Error(`Error updating user with ID ${userId}`);
      }

      return { user };
    } catch (error: any) {
      throw new Error(
        `Error updating user with ID ${userId}: ${error.message}`,
      );
    }
  }

  async delete(userId: string) {
    try {
      const user = await prisma.user.delete({ where: { id: userId } });
      if (!user) throw new Error("Error occurred while deleting the account");
      return { user };
    } catch (error: any) {
      throw new Error(
        `Error deleting user with ID ${userId}: ${error.message}`,
      );
    }
  }

  async userSearch(value: string) {
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: value, mode: "insensitive" } },
            { username: { contains: value, mode: "insensitive" } },
            { fullName: { contains: value, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          avatarUrl: true,
          isActive: true, // or isActive / online field
        },
      });

      const results: UserSearchResult[] = users.map((u) => ({
        user: {
          id: u.id,
          fullName: u.fullName || u.username || "Unknown",
          avatar: u.avatarUrl,
          isActive: u.isActive, // or u.isActive
        },
        conversation: null,
        hasExistingConversation: false,
      }));

      return { users: results };
    } catch (error: any) {
      throw new Error(
        `Error searching for users with value "${value}": ${error.message}`,
      );
    }
  }

  async getOneProfile(myUserId: string, userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          conversations: {
            where: { userId: myUserId },
            include: {
              conversation: {
                select: { id: true },
              },
            },
          },
        },
      });

      if (!user) throw new Error("User not found");

      const conversationId =
        user.conversations.length > 0
          ? user.conversations[0].conversation.id
          : null;

      const accountType =
        user.isPrivate && !conversationId ? "private" : "public";

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          isPrivate: accountType === "private",
          conversationId,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error: any) {
      throw new Error(`Error retrieving profile for user ${error.message}`);
    }
  }
}

export default new UserService();
