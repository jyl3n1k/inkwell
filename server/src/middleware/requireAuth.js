import { TokenService } from "../services/token.service.js";

export function requireAuth(req, res, next) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.get("Authorization") || "");
  try {
    if (!match) throw new Error("Missing token");
    const claims = TokenService.verifyAccessToken(match[1]);
    if (typeof claims.sub !== "string" || !claims.sub) {
      throw new Error("Missing identity");
    }
    req.authorId = claims.sub;
  } catch {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Please log in again before publishing.",
      },
    });
  }
  return next();
}
