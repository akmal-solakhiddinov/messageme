import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "default-access-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "default-refresh-secret-key";

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

interface UserTokenPayload {
  id: string;
  email?: string;
  fullName?: string;
}

interface DecodedToken {
  user: UserTokenPayload;
  iat: number;
  exp: number;
}

class TokenService {
  /**
   * Generate both access and refresh tokens
   */
  generateTokens(payload: UserTokenPayload) {
    const accessToken = jwt.sign({ user: payload }, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ user: payload }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate only access token (used during refresh)
   */
  generateAccessToken(payload: UserTokenPayload) {
    return jwt.sign({ user: payload }, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Generate only refresh token
   */
  generateRefreshToken(payload: UserTokenPayload) {
    return jwt.sign({ user: payload }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): UserTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as DecodedToken;
      return decoded.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): UserTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as DecodedToken;
      return decoded.user;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
