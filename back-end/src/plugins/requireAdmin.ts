import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { sub: string; email: string };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function requireAdminPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? (() => {
      throw new Error("Falta JWT_SECRET en las variables de entorno");
    })(),
  });

  app.decorate("requireAdmin", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: "No autorizado." });
    }
  });
});
