

async function registerUsers(num) {
  for (let i = 1; i <= num; i++) {
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `test-user-${i}@example.com`,
          username: `testuser${i}`,
          fullName: `Test User ${i}`,
          password: "password123",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ User ${i} registered:`, data);
      } else {
        console.error(`❌ User ${i} failed:`, data);
      }
    } catch (error) {
      console.error(`❌ Error registering user ${i}:`, error);
    }
  }
}

// Usage
// registerUsers(400);
//
//
//

const  getUsers = async ()=>{
   const users = await fetch("http://localhost:4000/api/user/search?query=@example.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer  `, // Assuming you have auth
        },
      });

const data = await users.json()
console.log(data)
  return data
} 



getUsers()

async function createConversationsForUser(
  userId,
  totalConversations,
  number = 20,
) {
  console.log(
    `🚀 Creating ${totalConversations} conversations for ${userId}...\n`,
  );

  const conversations = [];

  for (let i = 1; i <= totalConversations; i++) {
    try {
      // Determine conversation type and participants
      let participantIds;
      let description;

      
     
        participantIds = [
          userId,
        ];
      description = `Large group ${i - 18}`;
  
      const response= await fetch("http://localhost:4000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNDI5ZGRmNGQtYTczYi00ZTM1LWJhMzEtYzE1YzM2NTg0OGNiIiwiZW1haWwiOiJ0ZXN0LXVzZXItMzkwQGV4YW1wbGUuY29tIiwiZnVsbE5hbWUiOiJUZXN0IFVzZXIgMzkwIn0sImlhdCI6MTc2ODUwNzg0MiwiZXhwIjoxNzY4NTA4NzQyfQ.uHcKgxwxKk0uwkI6YFyeHUM23OqozuIpjwC3BfyzTGM/`, // Assuming you have auth
        },
        body: JSON.stringify({
          participantIds,
          initialMessage: `Welcome to ${description}!`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ [${i}/${totalConversations}] Created: ${description}`);
        console.log(
          `   ID: ${data.id}, Participants: ${participantIds.length}`,
        );
        conversations.push(data);
      } else {
        console.error(
          `❌ [${i}/${totalConversations}] Failed: ${description}`,
          data,
        );
      }

      // Small delay to avoid rate limiting
      await delay(100);
    } catch (error) {
      console.error(`❌ Error creating conversation ${i}:`, error);
    }
  }

  console.log(`\n🎉 Created ${conversations.length} conversations!`);
  return conversations;
}
