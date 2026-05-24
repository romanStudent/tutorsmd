import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from 
import type { IncomingMessage, ServerResponse } from "http";
import type { Request } from "express";

import errorMiddleware from "../../middlewares/errorMiddleware";

// ── Routes ─────────────────────────────────────────────────────────────────────
// Все роуты лежат в presentation/routes/ — единственный источник
import AuthRouter from "../../presentation/routes/AuthRoutes";
import ClientRouter from "../../presentation/routes/ClientRoutes";
import TutorRouter from "../../presentation/routes/TutorRoutes";
import AdminRouter from "../../presentation/routes/AdminRoutes";
import UserRouter from "../../presentation/routes/UserRoutes";
import ReviewRoutes from "../../presentation/routes/ReviewRoutes";
import FileRoutes from "../../presentation/routes/FileRoutes";
import { apiLimiter } from "../../presentation/middlewares/rateLimiter";

declare module "express-serve-static-core" {
  interface Request {
    rawBody?: Buffer;
  }
}

// Файлы не идут через Express — только JSON/form + presigned URL для R2
const JSON_LIMIT = "100kb";
const URL_ENCODED_LIMIT = "50kb";

export const createApp = () => {
  const app = express();

  // ── Reverse proxy (Nginx перед Node на Hetzner) ───────────────────────────
  app.set("trust proxy", 1);

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false, // настраивается на фронте
      hidePoweredBy: true,
      crossOriginResourcePolicy: { policy: "cross-origin" }, // для R2 redirect
    })
  );

  // ── Compression ───────────────────────────────────────────────────────────
  app.use(compression());

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CLIENT_URL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, cb) => {
        // Без origin — мобильные клиенты, curl в dev
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin "${origin}" not allowed`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86_400, // preflight кеш 24ч
    })
  );

  // ── Parsers ────────────────────────────────────────────────────────────────
  app.use(cookieParser());
  app.use(
    express.json({
      limit: JSON_LIMIT,
      verify: (
        req: IncomingMessage & { rawBody?: Buffer },
        _res: ServerResponse,
        buf: Buffer
      ) => {
        (req as Request).rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true, limit: URL_ENCODED_LIMIT }));

  // ── Global API rate limit ─────────────────────────────────────────────────
  app.use("/api", apiLimiter);

  // ── API Routes ─────────────────────────────────────────────────────────────
  app.use("/api/auth", AuthRouter, );
  app.use("/api/clients", ClientRouter);
  app.use("/api/tutors", TutorRouter);
  app.use("/api/admin", AdminRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/reviews", ReviewRoutes);
  app.use("/api/files", FileRoutes); 


  app.get("/health", (_req, res) => res.json({ status: "ok" }));


  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  app.use(errorMiddleware);



  return app;
};