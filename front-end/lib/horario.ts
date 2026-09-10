// Debe coincidir con back-end/src/lib/horario.ts y con Contacto.tsx.
export const HORARIOS: Record<number, { abre: number; cierra: number } | null> = {
  0: { abre: 10, cierra: 15 }, // domingo
  1: { abre: 9, cierra: 20 }, // lunes
  2: { abre: 9, cierra: 20 },
  3: { abre: 9, cierra: 20 },
  4: { abre: 9, cierra: 20 },
  5: { abre: 9, cierra: 20 }, // viernes
  6: { abre: 9, cierra: 18 }, // sábado
};

export const OFFSET_LOCAL = "-06:00";
export const DURACION_SLOT_MIN = 30;

/** Genera los horarios "HH:MM" disponibles para una fecha "YYYY-MM-DD". */
export function generarSlots(fechaISO: string): string[] {
  const dia = new Date(`${fechaISO}T00:00:00Z`).getUTCDay();
  const horario = HORARIOS[dia];
  if (!horario) return [];

  const slots: string[] = [];
  for (let mins = horario.abre * 60; mins < horario.cierra * 60; mins += DURACION_SLOT_MIN) {
    const hh = String(Math.floor(mins / 60)).padStart(2, "0");
    const mm = String(mins % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

/** Convierte el ISO (UTC) de una cita ya guardada a "HH:MM" en hora de Pachuca. */
export function horaLocalDesdeISO(fechaISO: string): string {
  const d = new Date(fechaISO);
  let hh = d.getUTCHours() - 6;
  if (hh < 0) hh += 24;
  return `${String(hh).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** YYYY-MM-DD de "hoy" en hora de Pachuca, para limitar el selector de fecha. */
export function hoyLocal(): string {
  const ahora = new Date();
  const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60_000;
  const pachuca = new Date(utc - 6 * 60 * 60_000);
  return pachuca.toISOString().slice(0, 10);
}
