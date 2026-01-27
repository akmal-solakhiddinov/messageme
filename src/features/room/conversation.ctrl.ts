import { Request, Response, NextFunction } from "express";
import roomService from "./conversation.service";
import ConversationRouter from "./conversation.route";

class ConversationCtrl {
  async getOrCreateConversation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const myId = req.user!.id;
      const otherId = req.params.conversationId;

      console.log(otherId, "==============other id ========================");

      const { conversation } = await roomService.getOrCreateConversation(
        myId,

        otherId,
      );
      res.status(201).json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMyConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const myId = req.user!.id;
      if (!myId) throw new Error("Authorization failure");

      const { conversations } = await roomService.getMyConversations(myId);
      res.status(201).json(conversations);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async roomMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = req.params.roomId;
      const pagination = req.query;
      const { messages } = await roomService.getMessages(
        roomId,
        req.user!.id,
        pagination,
      );

      res.status(201).json(messages);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  /*
    async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const { roomId } = req.params;
        const { room } = await roomService.delete(roomId);
  
        res.status(201).json(room);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  }
  */
}
export default new ConversationCtrl();
