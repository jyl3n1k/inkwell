import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ValidationError } from "../utils/validation.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res) => {
  try {
    const { title, body, tagNames = [] } = req.body || {};

    const post = await PostService.publish({
      authorId: req.user.id,
      title,
      body,
      tagNames
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
    const page = Number(req.query.page ?? 1);
    if (!Number.isSafeInteger(page) || page < 1) {
      return res.status(400).json({
        error: { code: "INVALID_PAGE", message: "page must be a positive integer." },
      });
    }
    const rawPageSize = req.query.pageSize;
    const pageSize = rawPageSize === undefined ? 10 : Number(rawPageSize);
    if ((rawPageSize !== undefined && typeof rawPageSize !== "string") ||
        !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        error: { code: "INVALID_PAGE_SIZE", message: "pageSize must be an integer between 1 and 100." },
      });
    }
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const result = search
      ? await PostService.search({ query: search, page, pageSize })
      : await PostService.listPublished({ page, pageSize });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
