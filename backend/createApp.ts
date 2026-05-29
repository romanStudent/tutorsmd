import express        from "express";
import cors           from "cors";
import cookieParser   from "cookie-parser";
import helmet         from "helmet";
import compression    from "compression";
import type { IncomingMessage, ServerResponse } from "http";
import type { Request }                          from "express";

import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import { apiLimiter }      from "./presentation/middlewares/rateLimiter";

// Роутеры — фабрики, принимают controller из DI
import { createAuthRouter }        from "./presentation/routes/AuthRoutes";
import { createTutorRouter }       from "./presentation/routes/tutor/TutorRoutes";
import { createTutorPublicRouter } from "./presentation/routes/tutor/TutorPublicRoutes";
import { createReviewRouter }      from "./presentation/routes/ReviewRoutes";
import { createAvailableSlotRouter }      from "./presentation/routes/AvailableSlotRoutes";
import { createAppealRouter }        from "./presentation/routes/AppealRoutes";
import { createFeedbackRouter }       from "./presentation/routes/FeedbackRoutes";
import { createProfileRouter }       from "./presentation/routes/ProfileRoutes";
import { createQuizRouter }       from "./presentation/routes/QuizRoutes";
import { createLessonRouter }      from "./presentation/routes/LessonRoutes";


import {
  authController,
  profileController,
  tutorController,
  tutorPublicController,
  lessonController,
  availableSlotController,
  reviewController,
  quizController,
  appealController,
  feedbackController,
  supportChatController,
} from "./di/container";
import { createSupportChatRouter } from "./presentation/routes/SupportChatRoutes";

declare module "express-serve-static-core" {
  interface Request { rawBody?: Buffer; }
}

const JSON_LIMIT        = "100kb";
const URL_ENCODED_LIMIT = "50kb";

export const createApp = () => {
  const app = express();

  // ── Reverse proxy ─────────────────────────────────────────────────────────
  app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : 0);

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy:        false,
    hidePoweredBy:                true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // ── Compression ───────────────────────────────────────────────────────────
  app.use(compression());

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CLIENT_URL ?? "")
    .split(",").map(s => s.trim()).filter(Boolean);

  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge:         86_400,
  }));

  // ── Parsers ───────────────────────────────────────────────────────────────
  app.use(cookieParser());
  app.use(express.json({
    limit: JSON_LIMIT,
    verify: (
      req: IncomingMessage & { rawBody?: Buffer },
      _res: ServerResponse,
      buf: Buffer,
    ) => { (req as Request).rawBody = buf; },
  }));
  app.use(express.urlencoded({ extended: true, limit: URL_ENCODED_LIMIT }));

  // ── Global rate limit (только HTTP, не WebSocket) ─────────────────────────
  app.use("/api", apiLimiter);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use("/api/auth",    createAuthRouter(authController));
  app.use("/api/tutors",  createTutorPublicRouter(tutorPublicController));
  app.use("/api/tutors",  createTutorRouter(tutorController));
  // app.use("/api/clients", createClientRouter(clientController));
  // app.use("/api/admin",   createAdminRouter(adminController));
  app.use("/api/profile",   createProfileRouter(profileController));
  app.use("/api/reviews", createReviewRouter(reviewController));
 


  app.use("/api/support", createSupportChatRouter(supportChatController));
  app.use("/api/lessons", createLessonRouter(lessonController));
  app.use("/api/quizzes", createQuizRouter(quizController));
  app.use("/api/slots",   createAvailableSlotRouter(availableSlotController));
  app.use("/api/appeals", createAppealRouter(appealController));
  app.use("/api/feedback", createFeedbackRouter(feedbackController));

  // ── Health ────────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", ts: new Date().toISOString() });
  });

  // ── 404 ───────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // ── Error handler ─────────────────────────────────────────────────────────
  app.use(errorMiddleware);

  return app;
};