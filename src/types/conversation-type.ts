export type ConversationItemData = {
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    isActive: boolean;
  };
  lastMessage?: string; // optional
  lastMessageTime?: string; // optional, ISO string is fine
  unreadCount: number;
};
