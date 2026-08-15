import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function personasRoutes(app: FastifyInstance) {
  app.get("/personas", async () => {
    return prisma.personaReconocida.findMany({
      orderBy: { creadoEn: "desc" },
    });
  });
}
