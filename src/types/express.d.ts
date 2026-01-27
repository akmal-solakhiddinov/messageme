import "express";

declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string>;
      user?: {
        id: string;
      };
    }
  }
}
