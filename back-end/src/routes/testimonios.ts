import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function testimoniosRoutes(app: FastifyInstance) {
  app.get("/testimonios", async () => {
    return prisma.testimonio.findMany({
      where: { aprobado: true },
      orderBy: { creadoEn: "desc" },
    });
  });
}
