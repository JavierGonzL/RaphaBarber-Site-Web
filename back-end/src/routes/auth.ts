import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

type AttemptState = {
  failedCount: number;
  windowStart: number;
  blockedUntil: number;
};

const attemptByIp = new Map<string, AttemptState>();
const attemptByIpAndEmail = new Map<string, AttemptState>();

const LOGIN_WINDOW_MS = Number(
  process.env.ADMIN_LOGIN_WINDOW_MS ?? 15 * 60 * 1000,
);
const LOCK_TIME_MS = Number(process.env.ADMIN_LOGIN_LOCK_MS ?? 15 * 60 * 1000);
const MAX_IP_ATTEMPTS = Number(process.env.ADMIN_LOGIN_MAX_IP_ATTEMPTS ?? 20);
const MAX_IP_EMAIL_ATTEMPTS = Number(
  process.env.ADMIN_LOGIN_MAX_IP_EMAIL_ATTEMPTS ?? 5,
);

function getOrCreateState(
  map: Map<string, AttemptState>,
  key: string,
  now: number,
): AttemptState {
  const current = map.get(key);
  if (!current) {
    const created = { failedCount: 0, windowStart: now, blockedUntil: 0 };
    map.set(key, created);
    return created;
  }

  if (now - current.windowStart > LOGIN_WINDOW_MS) {
    current.failedCount = 0;
    current.windowStart = now;
  }

  return current;
}

function isBlocked(state: AttemptState, now: number): boolean {
  return state.blockedUntil > now;
}

function registerFailure(
  state: AttemptState,
  maxAttempts: number,
  now: number,
) {
  state.failedCount += 1;
  if (state.failedCount >= maxAttempts) {
    state.blockedUntil = now + LOCK_TIME_MS;
  }
}

function resetAttempts(state: AttemptState) {
  state.failedCount = 0;
  state.windowStart = Date.now();
  state.blockedUntil = 0;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getClientIp(requestIp: string | undefined): string {
  return requestIp?.trim() || "unknown";
}

const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", minLength: 1 },
      password: { type: "string", minLength: 1 },
    },
  },
} as const;

type LoginBody = { email: string; password: string };

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: LoginBody }>(
    "/auth/admin/login",
    { schema: loginSchema },
    async (request, reply) => {
      const now = Date.now();
      const email = normalizeEmail(request.body.email);
      const { password } = request.body;
      const clientIp = getClientIp(request.ip);
      const ipKey = clientIp;
      const ipEmailKey = `${clientIp}|${email}`;

      const ipState = getOrCreateState(attemptByIp, ipKey, now);
      const ipEmailState = getOrCreateState(
        attemptByIpAndEmail,
        ipEmailKey,
        now,
      );

      if (isBlocked(ipState, now) || isBlocked(ipEmailState, now)) {
        return reply
          .status(429)
          .send({ error: "Demasiados intentos. Intenta de nuevo más tarde." });
      }

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) {
        registerFailure(ipState, MAX_IP_ATTEMPTS, now);
        registerFailure(ipEmailState, MAX_IP_EMAIL_ATTEMPTS, now);

        if (isBlocked(ipState, now) || isBlocked(ipEmailState, now)) {
          return reply
            .status(429)
            .send({
              error: "Demasiados intentos. Intenta de nuevo más tarde.",
            });
        }

        return reply
          .status(401)
          .send({ error: "Correo o contraseña incorrectos." });
      }

      const passwordOk = await bcrypt.compare(password, admin.passwordHash);
      if (!passwordOk) {
        registerFailure(ipState, MAX_IP_ATTEMPTS, now);
        registerFailure(ipEmailState, MAX_IP_EMAIL_ATTEMPTS, now);

        if (isBlocked(ipState, now) || isBlocked(ipEmailState, now)) {
          return reply
            .status(429)
            .send({
              error: "Demasiados intentos. Intenta de nuevo más tarde.",
            });
        }

        return reply
          .status(401)
          .send({ error: "Correo o contraseña incorrectos." });
      }

      resetAttempts(ipState);
      resetAttempts(ipEmailState);

      const token = app.jwt.sign(
        { sub: admin.id, email: admin.email },
        { expiresIn: "12h" },
      );
      return { token };
    },
  );

  app.get("/admin/me", { preHandler: app.requireAdmin }, async (request) => {
    return { email: request.user.email };
  });
}
