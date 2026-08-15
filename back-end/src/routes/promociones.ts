import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function promocionesRoutes(app: FastifyInstance) {
  app.get("/promociones", async () => {
    const ahora = new Date();
    return prisma.promocion.findMany({
      where: {
        activa: true,
        AND: [
          { OR: [{ vigenciaInicio: null }, { vigenciaInicio: { lte: ahora } }] },
          { OR: [{ vigenciaFin: null }, { vigenciaFin: { gte: ahora } }] },
        ],
      },
      orderBy: { creadoEn: "desc" },
    });
  });
}
