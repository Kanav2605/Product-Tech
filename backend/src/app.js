import cors from "cors";
import express from "express";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "catalog-api" });
});

app.use("/api/products", productRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
});

export default app;
