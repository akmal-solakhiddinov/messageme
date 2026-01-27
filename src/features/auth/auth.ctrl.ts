import { Request, Response, NextFunction } from "express";
import authService from "./auth.service";
import logger from "../../utils/logger";

class AuthCtrl {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body;

      const data = await authService.register(fullName, email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", data.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(data);
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", data.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      const { message } = await authService.logout(userId);
      res.clearCookie("refreshToken");
      res.status(200).json({ message, success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) throw new Error("refresh token is missing");
      const data = await authService.refresh(refreshToken);
      res.cookie("accessToken", data.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      console.log(data.accessToken, "log token");
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthCtrl();
