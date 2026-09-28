import { Router } from "express";
import { getPublishStats } from "../events/listeners/count-published-posts.listener.js";

const router = Router();
router.get("/stats", (_req, res) => {
  res.status(200).json(getPublishStats());
});
export default router;
