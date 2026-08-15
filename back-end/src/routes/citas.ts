import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { crearEventoDesdeCita } from "../lib/googleCalendar.js";
import { OFFSET_LOCAL, validarDentroDeHorario } from "../lib/horario.js";

const crearCitaSchema = {
  body: {
    type: "object",
    required: ["clienteNombre", "clienteTelefono", "servicioId", "fecha"],
    properties: {
      clienteNombre: { type: "string", minLength: 1 },
      clienteTelefono: { type: "string", minLength: 1 },
      servicioId: { type: "string", minLength: 1 },
      fecha: { type: "string", format: "date-time" },
      notas: { type: "string" },
    },
  },
} as const;

type CrearCitaBody = {
  clienteNombre: string;
  clienteTelefono: string;
  servicioId: string;
  fecha: string;
  notas?: string;
};

export async function citasRoutes(app: FastifyInstance) {
  app.post<{ Body: CrearCitaBody }>(
    "/citas",
    { schema: crearCitaSchema },
    async (request: FastifyRequest<{ Body: CrearCitaBody }>, reply) => {
      const { clienteNombre, clienteTelefono, servicioId, fecha, notas } = request.body;

      const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
      if (!servicio || !servicio.activo) {
        return reply.status(400).send({ error: "El servicio indicado no existe o no está disponible." });
      }

      const fechaCita = new Date(fecha);
      if (Number.isNaN(fechaCita.getTime())) {
        return reply.status(400).send({ error: "La fecha no es válida." });
      }
      if (fechaCita.getTime() < Date.now()) {
        return reply.status(400).send({ error: "No se puede reservar una fecha que ya pasó." });
      }

      const errorHorario = validarDentroDeHorario(fecha);
      if (errorHorario) {
        return reply.status(400).send({ error: errorHorario });
      }

      const conflicto = await prisma.cita.findFirst({
        where: { fecha: fechaCita, estado: { not: "cancelada" } },
      });
      if (conflicto) {
        return reply.status(409).send({ error: "Ese horario ya fue tomado, elige otro." });
      }

      const cita = await prisma.cita.create({
        data: {
          clienteNombre,
          clienteTelefono,
          servicioId,
          fecha: fechaCita,
          notas,
          estado: "pendiente",
        },
        include: { servicio: true },
      });

      // La cita ya quedó guardada; si Google falla (o no hay cuenta conectada
      // todavía), no se bloquea al cliente — se reintenta después a mano.
      try {
        const googleEventId = await crearEventoDesdeCita(cita);
        if (googleEventId) {
          await prisma.cita.update({ where: { id: cita.id }, data: { googleEventId } });
          cita.googleEventId = googleEventId;
        }
      } catch (err) {
        request.log.error(err, "No se pudo sincronizar la cita con Google Calendar");
      }

      return reply.status(201).send(cita);
    }
  );

  app.get<{ Querystring: { fecha?: string } }>("/citas", async (request, reply) => {
    const { fecha } = request.query;
    if (!fecha) {
      return reply.status(400).send({ error: "Falta el parámetro 'fecha' (YYYY-MM-DD)." });
    }

    const inicio = new Date(`${fecha}T00:00:00${OFFSET_LOCAL}`);
    if (Number.isNaN(inicio.getTime())) {
      return reply.status(400).send({ error: "El parámetro 'fecha' no es válido (usa YYYY-MM-DD)." });
    }
    const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);

    return prisma.cita.findMany({
      where: {
        fecha: { gte: inicio, lt: fin },
        estado: { not: "cancelada" },
      },
      orderBy: { fecha: "asc" },
      include: { servicio: true },
    });
  });
}
