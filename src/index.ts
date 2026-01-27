import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import logger from "./utils/logger";
import { initializeSocketHandlers } from "./socket/socket";
import { Server as IoServer } from "socket.io";
import cookieParser from "cookie-parser";

import AuthRouter from "./features/auth/auth.route";
import userRouter from "./features/user/user.routes";
import { requestLogger } from "./middlewares/request.middleware";
import ConversationRouter from "./features/room/conversation.route";
import main from "./seeds/conv";
import MessagesRouter from "./features/message/message.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);
const io = new IoServer(httpServer);
initializeSocketHandlers(io);
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(requestLogger);

app.get("/", (req, res) => {
  // main();
  res.json({ message: "Hello world" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", userRouter);
app.use("/api/conversations", ConversationRouter);
app.use("/api/messages", MessagesRouter);

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
