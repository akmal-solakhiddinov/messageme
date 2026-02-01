import { Router } from "express";
import conversationCtrl from "./conversation.ctrl";
import { AuthMiddleware } from "../../middlewares/auth.middlewares";

const ConversationRouter = Router();

// create or get a conversation with a user
ConversationRouter.post(
  "/:friendId",
  AuthMiddleware,
  conversationCtrl.getOrCreateConversation,
);

// get my conversations (sidebar)
ConversationRouter.get(
  "/",
  AuthMiddleware,
  conversationCtrl.getMyConversations,
);

// get messages of a conversation
//router.get("/:conversationId/messages", auth, conversationCtrl.getMessages);

// delete a conversation (optional)
//router.delete("/:conversationId", auth, conversationCtrl.deleteConversation);

export default ConversationRouter;
