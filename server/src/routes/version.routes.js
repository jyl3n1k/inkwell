import { Router } from "express";

const router = Router();

router.get("/version", (req, res) => {
  res.status(200).json({
    version: "0.1.0"
  });
});

export default router;
