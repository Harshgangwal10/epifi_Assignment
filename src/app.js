import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({
    message: "Notes API is running",
    docs: "/openapi.json",
    about: "/about",
  });
});

app.use("/", miscRoutes);
app.use("/", authRoutes);
app.use("/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

