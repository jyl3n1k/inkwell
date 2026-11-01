import { logger } from "../lib/logger.js";

export function errorHandler(err, _req, res, _next) {
  logger.error({ err }, "Request failed");
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: isProd ? "Something went wrong." : err.message,
    },
  });
}
