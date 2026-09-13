import "dotenv/config";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import versionRoutes from "./routes/version.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", versionRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message
    }
  });
});

app.listen(PORT, () => {
  console.log(`Inkwell API listening on port ${PORT}`);
});
