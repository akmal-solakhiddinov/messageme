import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Assuming 'conversations' is fetched or defined above this snippet
  const conversations = await prisma.conversation.findMany({
    include: { participants: true },
  });

  console.log(`Seeding messages for ${conversations.length} conversations...`);

  for (const conv of conversations) {
    const participantIds = conv.participants.map((p: any) => p.userId);

    // 1. Generate 100 messages (Fixed field name to senderId)
    const messages = Array.from({ length: 100 }).map(() => {
      const senderId = faker.helpers.arrayElement(participantIds);
      return {
        id: faker.string.uuid(),
        conversationId: conv.id,
        senderId, // Changed from authorId to senderId to match your schema
        text: faker.lorem.sentence(),
      };
    });

    // 2. Insert all messages in bulk
    await prisma.message.createMany({
      data: messages,
    });

    // 3. Update lastMessageId in conversation
    const lastMessage = messages[messages.length - 1];
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastMessageId: lastMessage.id },
    });

    console.log(`Seeded 100 messages for conversation ${conv.id}`);
  }

  console.log("All messages seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
