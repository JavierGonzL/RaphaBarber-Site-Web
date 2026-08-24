import { prisma } from "./prisma.js";
import { crearEventoDesdeCita } from "./googleCalendar.js";

export const MINUTOS_EXPIRACION_PAGO = 15;

/** Fecha límite: las citas "pendiente_pago" creadas antes de esto ya no bloquean el horario. */
export function limiteExpiracionPago(): Date {
  return new Date(Date.now() - MINUTOS_EXPIRACION_PAGO * 60_000);
}

/**
 * Marca la cita como confirmada tras un pago aprobado y la sincroniza a
 * Google Calendar. Si Google falla, la cita queda confirmada de todos
 * modos — se puede reintentar el sync después a mano.
 */
export async function confirmarCitaPagada(citaId: string): Promise<void> {
  const cita = await prisma.cita.update({
    where: { id: citaId },
    data: { estado: "confirmada" },
    include: { servicio: true },
  });

  try {
    const googleEventId = await crearEventoDesdeCita(cita);
    if (googleEventId) {
      await prisma.cita.update({ where: { id: cita.id }, data: { googleEventId } });
    }
  } catch (err) {
    console.error("No se pudo sincronizar la cita pagada con Google Calendar:", err);
  }
}

/** Libera el horario: la cita pasa a cancelada porque el pago fue rechazado o expiró. */
export async function cancelarCitaPorPagoFallido(citaId: string): Promise<void> {
  await prisma.cita.update({ where: { id: citaId }, data: { estado: "cancelada" } });
}

/**
 * Condición Prisma que identifica citas que "ocupan" un horario: confirmadas,
 * pendientes (canal WhatsApp/admin), o pendientes de pago que todavía no
 * expiraron. Se usa tanto para el chequeo de doble reserva como para la
 * disponibilidad pública.
 */
export function condicionCitaActiva() {
  return {
    OR: [
      { estado: { in: ["confirmada", "pendiente"] } },
      { estado: "pendiente_pago", creadoEn: { gte: limiteExpiracionPago() } },
    ],
  };
}
