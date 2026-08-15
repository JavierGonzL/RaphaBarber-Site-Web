import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function videosRoutes(app: FastifyInstance) {
  app.get("/videos", async () => {
    return prisma.videoDestacado.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    });
  });
}
