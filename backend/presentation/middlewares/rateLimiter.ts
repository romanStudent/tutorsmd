import rateLimit, { Options } from "express-rate-limit";


const createLimiter = (opts: Pick<Options, "windowMs" | "max" | "message">) =>
  rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    // Ключ по IP — работает корректно если выставлен app.set("trust proxy", 1)
    keyGenerator: (req) =>
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      req.ip ??
      "unknown",
    ...opts,
  });


export const apiLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 300,
  message: { error: "Too many requests, please slow down" },
});


export const loginLimiter = createLimiter({
  windowMs: 15 * 60_000, // 15 минут
  max: 5,
  message: { error: "Too many login attempts, try again in 15 minutes" },
});

export const registerLimiter = createLimiter({
  windowMs: 60 * 60_000, // 1 час
  max: 3,
  message: { error: "Too many registration attempts, try again in 1 hour" },
});

export const forgotPasswordLimiter = createLimiter({
  windowMs: 60 * 60_000, // 1 час
  max: 3,
  message: { error: "Too many password reset attempts, try again in 1 hour" },
});

export const resendVerificationLimiter = createLimiter({
  windowMs: 10 * 60_000, // 10 минут
  max: 3,
  message: { error: "Too many verification requests, try again in 10 minutes" },
});