import { Router } from "express";
import messageCtrl from "./message.ctrl";
import { AuthMiddleware } from "../../middlewares/auth.middlewares";

const MessagesRouter = Router();

MessagesRouter.get(
  "/:conversationId/messages",
  AuthMiddleware,
  messageCtrl.getMessages,
);

MessagesRouter.post("/:conversationId/send", AuthMiddleware, messageCtrl.send);

export default MessagesRouter;
