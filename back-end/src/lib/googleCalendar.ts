import { google } from "googleapis";
import type { Cita, Servicio } from "@prisma/client";
import { prisma } from "./prisma.js";
import { decrypt } from "./crypto.js";
import { createOAuthClient } from "./googleAuth.js";

type CitaConServicio = Cita & { servicio: Servicio };

/**
 * Crea el evento en el Google Calendar del dueño para una cita ya guardada.
 * Devuelve null (en vez de lanzar) si todavía no hay ninguna cuenta conectada,
 * para que llamarlo sea seguro incluso antes de completar la Fase 7.
 */
export async function crearEventoDesdeCita(cita: CitaConServicio): Promise<string | null> {
  const integracion = await prisma.integracionGoogle.findFirst();
  if (!integracion) return null;

  const oauthClient = createOAuthClient();
  oauthClient.setCredentials({ refresh_token: decrypt(integracion.refreshTokenCifrado) });

  const calendar = google.calendar({ version: "v3", auth: oauthClient });

  const inicio = cita.fecha;
  const fin = new Date(inicio.getTime() + cita.servicio.duracion * 60_000);

  const { data } = await calendar.events.insert({
    calendarId: integracion.calendarId,
    requestBody: {
      summary: `${cita.servicio.nombre} — ${cita.clienteNombre}`,
      description: [
        `Cliente: ${cita.clienteNombre}`,
        `Teléfono: ${cita.clienteTelefono}`,
        cita.notas ? `Notas: ${cita.notas}` : null,
        "",
        "Agendado desde el sitio web de Rapha Barber.",
      ]
        .filter((linea) => linea !== null)
        .join("\n"),
      start: { dateTime: inicio.toISOString() },
      end: { dateTime: fin.toISOString() },
    },
  });

  return data.id ?? null;
}
