import { Router } from "express";
import {
  AuthService,
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  InvalidCredentialsError,
  ValidationError
} from "../services/auth.service.js";

import { authRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/auth/register", authRateLimiter, async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof EmailAlreadyRegisteredError) {
      return res.status(400).json({
        error: {
          code: "EMAIL_ALREADY_REGISTERED",
          message: "This email is already registered."
        }
      });
    }

    if (err instanceof WeakPasswordError) {
      return res.status(400).json({
        error: {
          code: "WEAK_PASSWORD",
          message: "Password does not meet strength requirements."
        }
      });
    }

    if (err instanceof ValidationError) {
      return res.status(400).json({ error: { code: err.code, message: err.message } });
    }
    return next(err);
  }
});

router.post("/auth/login", authRateLimiter, async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password."
        }
      });
    }

    return next(err);
  }
});

export default router;
