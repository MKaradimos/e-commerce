import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const buildApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api", routes);

  app.use(errorHandler);
  return app;
};
