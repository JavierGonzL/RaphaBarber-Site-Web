import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

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
  app.post<{ Body: LoginBody }>("/auth/admin/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return reply.status(401).send({ error: "Correo o contraseña incorrectos." });
    }

    const passwordOk = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordOk) {
      return reply.status(401).send({ error: "Correo o contraseña incorrectos." });
    }

    const token = app.jwt.sign({ sub: admin.id, email: admin.email }, { expiresIn: "12h" });
    return { token };
  });

  app.get("/admin/me", { preHandler: app.requireAdmin }, async (request) => {
    return { email: request.user.email };
  });
}
