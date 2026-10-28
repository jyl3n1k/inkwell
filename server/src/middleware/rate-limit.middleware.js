import { rateLimit } from "express-rate-limit";

// Shared per-IP budget for login and registration, including successful requests.
// Memory storage is suitable for this single-process workshop deployment.
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: {
    error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
