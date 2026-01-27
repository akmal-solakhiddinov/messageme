import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import logger from "../../utils/logger";
class UserController {
  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { user } = await userService.profile(userId);

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    console.log("Update process started");
    try {
      const userId = req.user!.id;
      /*const file = req.file;

      let fileUrl;
      if (file) {
        fileUrl = await uploadFile("IMAGE", file);
      }
      const updatedUser = {
        ...req.body,
        ...(fileUrl && { image: fileUrl }),
      };
      */

      logger.info("user updated body", req.body);
      const { user } = await userService.update(userId, req.body);
      res.status(201).json(user);
    } catch (error: any) {
      console.error("Update error:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { user } = await userService.delete(userId);
      res.status(201).json({ user, message: "User successfully deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async userSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.body?.params.query;
      console.log(
        query,
        "=========================request=======================",
      );
      if (!query) {
        res.status(400).json({ message: "Query is not defined" });
        return;
      }
      const { users } = await userService.userSearch(query);
      if (users?.length <= 0) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async getOneProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const myUserId = req.user!.id;
      const { userId } = req.params;
      const { user } = await userService.getOneProfile(myUserId, userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new UserController();
