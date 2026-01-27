export type MessageType = {
  content: string;
  attachmentUrl: string; // Fixed typo: added the 'n'
  attachmentType: AttachmentType;
  status: MessageStatus;
  senderId: string;
  conversationId: string;
};

enum MessageStatus {
  seen,
  unseen,
}

enum AttachmentType {
  IMAGE,
  VIDEO,
  FILE,
  AUDIO,
}

/*
 *
 

model Message {
  id             String          @id @default(uuid())
  content        String?         @db.Text
  attachmentUrl  String?         @db.Text
  attachmentType AttachmentType?

  senderId       String
  conversationId String

  status MessageStatus @default(unseen)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sender        User          @relation(fields: [senderId], references: [id], onDelete: Cascade)
  conversation  Conversation  @relation("ConversationMessages", fields: [conversationId], references: [id], onDelete: Cascade)
  lastMessageOf Conversation? @relation("LastMessage")
}

 *
 * */
