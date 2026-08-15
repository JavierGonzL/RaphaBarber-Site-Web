import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { prisma } from "../lib/prisma.js";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const promocionSchema = {
  type: "object",
  properties: {
    titulo: { type: "string", minLength: 1 },
    descripcion: { type: "string", minLength: 1 },
    imagenUrl: { type: "string" },
    vigenciaInicio: { type: "string", format: "date-time" },
    vigenciaFin: { type: "string", format: "date-time" },
    activa: { type: "boolean" },
  },
} as const;

const videoSchema = {
  type: "object",
  properties: {
    titulo: { type: "string", minLength: 1 },
    urlTiktok: { type: "string", minLength: 1 },
    etiqueta: { type: "string" },
    activo: { type: "boolean" },
    orden: { type: "integer" },
  },
} as const;

const personaSchema = {
  type: "object",
  properties: {
    nombre: { type: "string", minLength: 1 },
    cargo: { type: "string" },
    fotoUrl: { type: "string", minLength: 1 },
  },
} as const;

const testimonioSchema = {
  type: "object",
  properties: {
    nombre: { type: "string", minLength: 1 },
    texto: { type: "string", minLength: 1 },
    califica: { type: "integer", minimum: 1, maximum: 5 },
    aprobado: { type: "boolean" },
  },
} as const;

type PromocionBody = {
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  vigenciaInicio?: string;
  vigenciaFin?: string;
  activa?: boolean;
};

type VideoBody = {
  titulo: string;
  urlTiktok: string;
  etiqueta?: string;
  activo?: boolean;
  orden?: number;
};

type PersonaBody = {
  nombre: string;
  cargo?: string;
  fotoUrl: string;
};

type TestimonioBody = {
  nombre: string;
  texto: string;
  califica: number;
  aprobado?: boolean;
};

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.requireAdmin);

  // ---------- Promociones ----------
  app.get("/admin/promociones", async () => {
    return prisma.promocion.findMany({ orderBy: { creadoEn: "desc" } });
  });

  app.post<{ Body: PromocionBody }>(
    "/admin/promociones",
    { schema: { body: { ...promocionSchema, required: ["titulo", "descripcion"] } } },
    async (request, reply) => {
      const { vigenciaInicio, vigenciaFin, ...resto } = request.body;
      const promocion = await prisma.promocion.create({
        data: {
          ...resto,
          vigenciaInicio: vigenciaInicio ? new Date(vigenciaInicio) : undefined,
          vigenciaFin: vigenciaFin ? new Date(vigenciaFin) : undefined,
        },
      });
      return reply.status(201).send(promocion);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<PromocionBody> }>(
    "/admin/promociones/:id",
    { schema: { body: promocionSchema } },
    async (request, reply) => {
      const { vigenciaInicio, vigenciaFin, ...resto } = request.body;
      try {
        const promocion = await prisma.promocion.update({
          where: { id: request.params.id },
          data: {
            ...resto,
            vigenciaInicio: vigenciaInicio ? new Date(vigenciaInicio) : undefined,
            vigenciaFin: vigenciaFin ? new Date(vigenciaFin) : undefined,
          },
        });
        return promocion;
      } catch {
        return reply.status(404).send({ error: "Promoción no encontrada." });
      }
    }
  );

  app.delete<{ Params: { id: string } }>("/admin/promociones/:id", async (request, reply) => {
    try {
      await prisma.promocion.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Promoción no encontrada." });
    }
  });

  // ---------- Videos destacados ----------
  app.get("/admin/videos", async () => {
    return prisma.videoDestacado.findMany({ orderBy: { orden: "asc" } });
  });

  app.post<{ Body: VideoBody }>(
    "/admin/videos",
    { schema: { body: { ...videoSchema, required: ["titulo", "urlTiktok"] } } },
    async (request, reply) => {
      const video = await prisma.videoDestacado.create({ data: request.body });
      return reply.status(201).send(video);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<VideoBody> }>(
    "/admin/videos/:id",
    { schema: { body: videoSchema } },
    async (request, reply) => {
      try {
        const video = await prisma.videoDestacado.update({
          where: { id: request.params.id },
          data: request.body,
        });
        return video;
      } catch {
        return reply.status(404).send({ error: "Video no encontrado." });
      }
    }
  );

  app.delete<{ Params: { id: string } }>("/admin/videos/:id", async (request, reply) => {
    try {
      await prisma.videoDestacado.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Video no encontrado." });
    }
  });

  // ---------- Personas reconocidas ----------
  app.get("/admin/personas", async () => {
    return prisma.personaReconocida.findMany({ orderBy: { creadoEn: "desc" } });
  });

  app.post<{ Body: PersonaBody }>(
    "/admin/personas",
    { schema: { body: { ...personaSchema, required: ["nombre", "fotoUrl"] } } },
    async (request, reply) => {
      const persona = await prisma.personaReconocida.create({ data: request.body });
      return reply.status(201).send(persona);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<PersonaBody> }>(
    "/admin/personas/:id",
    { schema: { body: personaSchema } },
    async (request, reply) => {
      try {
        const persona = await prisma.personaReconocida.update({
          where: { id: request.params.id },
          data: request.body,
        });
        return persona;
      } catch {
        return reply.status(404).send({ error: "Persona no encontrada." });
      }
    }
  );

  app.delete<{ Params: { id: string } }>("/admin/personas/:id", async (request, reply) => {
    try {
      await prisma.personaReconocida.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Persona no encontrada." });
    }
  });

  // ---------- Comentarios (Testimonio) ----------
  app.get("/admin/testimonios", async () => {
    return prisma.testimonio.findMany({ orderBy: { creadoEn: "desc" } });
  });

  app.post<{ Body: TestimonioBody }>(
    "/admin/testimonios",
    { schema: { body: { ...testimonioSchema, required: ["nombre", "texto", "califica"] } } },
    async (request, reply) => {
      const testimonio = await prisma.testimonio.create({ data: request.body });
      return reply.status(201).send(testimonio);
    }
  );

  app.put<{ Params: { id: string }; Body: Partial<TestimonioBody> }>(
    "/admin/testimonios/:id",
    { schema: { body: testimonioSchema } },
    async (request, reply) => {
      try {
        const testimonio = await prisma.testimonio.update({
          where: { id: request.params.id },
          data: request.body,
        });
        return testimonio;
      } catch {
        return reply.status(404).send({ error: "Comentario no encontrado." });
      }
    }
  );

  app.delete<{ Params: { id: string } }>("/admin/testimonios/:id", async (request, reply) => {
    try {
      await prisma.testimonio.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Comentario no encontrado." });
    }
  });

  // ---------- Subida de imágenes ----------
  app.post("/admin/upload", async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ error: "No se recibió ningún archivo." });
    }
    if (!TIPOS_PERMITIDOS.has(file.mimetype)) {
      return reply.status(400).send({ error: "Formato de imagen no soportado (usa JPG, PNG, WEBP o GIF)." });
    }

    await mkdir(UPLOADS_DIR, { recursive: true });

    const extension = path.extname(file.filename) || `.${file.mimetype.split("/")[1]}`;
    const nombreArchivo = `${randomUUID()}${extension}`;
    const destino = path.join(UPLOADS_DIR, nombreArchivo);

    await pipeline(file.file, createWriteStream(destino));

    return reply.status(201).send({ url: `/uploads/${nombreArchivo}` });
  });
}
