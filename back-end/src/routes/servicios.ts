import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function serviciosRoutes(app: FastifyInstance) {
  app.get("/servicios", async () => {
    return prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    });
  });
}
