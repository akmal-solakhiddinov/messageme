import { Socket } from "socket.io";
import { EVENTS } from "../socketEvents";
import logger from "../../utils/logger";
import userService from "../../features/user/user.service";

export const userHandler = async (socket: Socket) => {
  logger.info("user handle");
  socket.join(`user:${socket.data.userId}`);
  await userService.update(socket.data.userId, { isActive: true });
  logger.info(`Client connected: [${socket.data.userId}]`);

  socket.on("disconnect", async () => {
    logger.info(`User ${socket.data.userId} is offline`);

    await userService.update(socket.data.userId, { isActive: false });
  });
};
