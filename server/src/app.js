import { errorHandler } from "./middleware/error-handler.js";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import versionRoutes from "./routes/version.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import "./events/listeners/log-published-posts.listener.js";

export const app = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", versionRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", statsRoutes);

app.use(errorHandler);
