import { Request, Response, NextFunction } from "express";
import tokenService from "../features/tokens/token";
import logger from "../utils/logger";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ message: "Unauthorized, missing" });
      return; // Add return here
    }

    const payload = tokenService.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ message: "Unauthorized, token not verified" });
      return;
    }

    req.user = { id: payload.id }; // TypeScript now recognizes this
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
    return; // Add return here too
  }
};
