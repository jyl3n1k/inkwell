import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ValidationError } from "../utils/validation.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res) => {
  try {
    const { title, body } = req.body || {};

    const post = await PostService.publish({
      authorId: req.authorId,
      title,
      body
    });

    return res.status(201).json(post);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error: { code: err.code, message: err.message },
      });
    }
    if (err.code === "P2003") {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Your account is no longer available. Please register or log in again.",
        },
      });
    }
    console.error("Publishing failed:", err);
    return res.status(500).json({
      error: {
        code: "PUBLISH_FAILED",
        message: "Unable to publish your post. Please try again."
      }
    });
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const result = await PostService.listPublished({ page });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
