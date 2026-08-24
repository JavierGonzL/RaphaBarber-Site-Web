import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { OFFSET_LOCAL, validarDentroDeHorario } from "../lib/horario.js";
import { condicionCitaActiva } from "../lib/citas.js";
import { crearPreferenciaAnticipo, DEPOSITO_MONTO } from "../lib/mercadoPago.js";

const crearReservaSchema = {
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

type CrearReservaBody = {
  clienteNombre: string;
  clienteTelefono: string;
  servicioId: string;
  fecha: string;
  notas?: string;
};

export async function reservasRoutes(app: FastifyInstance) {
  app.post<{ Body: CrearReservaBody }>(
    "/reservas",
    { schema: crearReservaSchema },
    async (request: FastifyRequest<{ Body: CrearReservaBody }>, reply) => {
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
        where: { fecha: fechaCita, ...condicionCitaActiva() },
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
          estado: "pendiente_pago",
        },
      });

      try {
        const { preferenceId, initPoint } = await crearPreferenciaAnticipo({
          citaId: cita.id,
          servicioNombre: servicio.nombre,
          clienteNombre,
        });

        await prisma.pago.create({
          data: {
            citaId: cita.id,
            mpPreferenceId: preferenceId,
            monto: DEPOSITO_MONTO,
            estado: "pendiente",
          },
        });

        return reply.status(201).send({ citaId: cita.id, initPoint });
      } catch (err) {
        request.log.error(err, "No se pudo crear la preferencia de pago en Mercado Pago");
        await prisma.cita.delete({ where: { id: cita.id } });
        return reply.status(502).send({ error: "No se pudo iniciar el pago. Intenta de nuevo en unos minutos." });
      }
    }
  );

  app.get<{ Params: { citaId: string } }>("/reservas/:citaId", async (request, reply) => {
    const cita = await prisma.cita.findUnique({
      where: { id: request.params.citaId },
      include: { servicio: true },
    });

    if (!cita) {
      return reply.status(404).send({ error: "Reserva no encontrada." });
    }

    return {
      id: cita.id,
      estado: cita.estado,
      servicio: cita.servicio.nombre,
      fecha: cita.fecha,
    };
  });
}
