import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcrypt";
import tokenService from "../tokens/token";
import logger from "../../utils/logger";
import token from "../tokens/token";
const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // Use a constant for bcrypt salt rounds

class AuthService {
  async register(fullName: string, email: string, password: string) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) throw new Error("Email already in use");

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          email,
          fullName,
          password: hashedPassword,
        },
      });

      if (!user) {
        throw new Error("User could not be created");
      }

      const tokens = tokenService.generateTokens({
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName ? user.fullName : "",
      });

      return {
        user,
        ...tokens,
      };
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email: string, password: string) {
    try {
      console.log("started");
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const tokens = tokenService.generateTokens({
        id: user.id,
        email: user.email,
      });

      return {
        user,
        ...tokens,
      };
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout(userId: string) {
    try {
      return { message: "Logout successful" };
    } catch (error: any) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async refresh(refreshToken: string) {
    try {
      if (!refreshToken) {
        logger.info("Bad authorization");
        throw new Error("Bad authorization");
      }

      const userPayload = tokenService.verifyRefreshToken(refreshToken);

      if (!userPayload) throw new Error("Bad authorization");
      const user = await prisma.user.findUnique({
        where: { id: userPayload.id },
      });

      if (!user)
        throw new Error("Generating new refresh token user not defined");

      const tokens = tokenService.generateAccessToken({
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName ? user.fullName : "",
      });

      return { user: user, accessToken: tokens };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
