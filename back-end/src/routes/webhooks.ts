import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { obtenerPago, verificarFirmaWebhook } from "../lib/mercadoPago.js";
import { confirmarCitaPagada, cancelarCitaPorPagoFallido } from "../lib/citas.js";

type WebhookQuery = { "data.id"?: string; id?: string; topic?: string; type?: string };

export async function webhooksRoutes(app: FastifyInstance) {
  app.post<{ Querystring: WebhookQuery }>("/webhooks/mercadopago", async (request: FastifyRequest<{ Querystring: WebhookQuery }>, reply) => {
    const dataId = request.query["data.id"] ?? request.query.id;
    const tipo = request.query.type ?? request.query.topic;

    // Mercado Pago manda notificaciones de varios tipos (payment, merchant_order, etc.);
    // solo nos interesan las de pago.
    if (tipo && tipo !== "payment") {
      return reply.status(200).send({ ok: true });
    }
    if (!dataId) {
      return reply.status(200).send({ ok: true });
    }

    const firmaValida = verificarFirmaWebhook({
      xSignature: request.headers["x-signature"] as string | undefined,
      xRequestId: request.headers["x-request-id"] as string | undefined,
      dataId,
    });
    if (!firmaValida) {
      request.log.warn("Webhook de Mercado Pago con firma inválida, ignorado.");
      return reply.status(401).send({ error: "Firma inválida." });
    }

    // La firma solo confirma que el mensaje viene de Mercado Pago; el estado
    // real del pago se consulta directo a su API, nunca se confía en el payload.
    const pago = await obtenerPago(dataId);
    const citaId = pago.external_reference;
    if (!citaId) {
      return reply.status(200).send({ ok: true });
    }

    const registroPago = await prisma.pago.findFirst({ where: { citaId } });

    if (pago.status === "approved") {
      if (registroPago) {
        await prisma.pago.update({
          where: { id: registroPago.id },
          data: { estado: "aprobado", mpPaymentId: String(pago.id) },
        });
      }
      const cita = await prisma.cita.findUnique({ where: { id: citaId } });
      if (cita && cita.estado === "pendiente_pago") {
        await confirmarCitaPagada(citaId);
      }
    } else if (pago.status === "rejected" || pago.status === "cancelled") {
      if (registroPago) {
        await prisma.pago.update({
          where: { id: registroPago.id },
          data: { estado: "rechazado", mpPaymentId: String(pago.id) },
        });
      }
      const cita = await prisma.cita.findUnique({ where: { id: citaId } });
      if (cita && cita.estado === "pendiente_pago") {
        await cancelarCitaPorPagoFallido(citaId);
      }
    }

    return reply.status(200).send({ ok: true });
  });
}
