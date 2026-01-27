export type UserSearchResult = {
  user: {
    id: string;
    fullName: string;
    avatar: string | null;
    isActive: boolean;
  };
  conversation: null | {
    id: string;
    lastMessage?: string;
  };
  hasExistingConversation: boolean;
};
