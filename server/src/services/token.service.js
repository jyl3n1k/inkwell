import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET ||
    Buffer.byteLength(ACCESS_TOKEN_SECRET) < 32 ||
    Buffer.byteLength(REFRESH_TOKEN_SECRET) < 32 ||
    ACCESS_TOKEN_SECRET === REFRESH_TOKEN_SECRET) {
  throw new Error("Set distinct ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET values of at least 32 bytes.");
}

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

export const TokenService = {
  issueTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TTL
    });

    return {
      accessToken,
      refreshToken
    };
  },

  verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  },

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
};
