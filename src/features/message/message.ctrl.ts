import { NextFunction, Request, Response } from "express";
import messageService from "./message.service";

class MessageCtrl {
  async send(req: Request, res: Response, next: NextFunction) {
    try {
      const { content } = req.body; // Based on SendMessageRequest type
      const senderId = req.user?.id; // Assuming user is attached via middleware
      const conversationId = req.params.conversationId; // Usually passed in URL params

      if (!content || !senderId || !conversationId) {
        return res.status(400).json({
          message:
            "Required fields (content, senderId, or conversationId) are missing",
        });
      }

      // Logic to save message via service
      const newMessage = await messageService.send({
        senderId,
        conversationId,
        content,
      });

      // Returns SendMessageResponse
      return res.status(201).json({ message: newMessage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const conversationId = req.params.conversationId;

      if (!conversationId) {
        return res.status(400).json({ message: "conversationId is required" });
      }

      const messages = await messageService.getMessages(conversationId);

      // Returns MessagesResponse
      return res.status(200).json({ messages });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // To be implemented
  async update(req: Request, res: Response) {
    /* Logic for marking as read/delivered */
  }
  async delete(req: Request, res: Response) {
    /* Logic for deleting messages */
  }
}

export default new MessageCtrl();
