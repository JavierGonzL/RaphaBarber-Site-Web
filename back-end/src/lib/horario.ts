// Horario de atención (hora de Pachuca, Hidalgo — UTC-6 todo el año, sin horario de verano).
// Mismo horario que se muestra en el sitio (components/sections/Contacto.tsx).
// Índice = Date.getUTCDay() / getDay(): 0 domingo ... 6 sábado.
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

/**
 * Valida que una fecha (string tal como la manda el front-end, ej.
 * "2026-08-20T11:00:00-06:00") caiga dentro del horario de atención.
 * Lee directamente el día/hora escritos en el string en vez de convertir
 * zonas horarias, así el resultado no depende de en qué huso horario
 * esté corriendo el servidor.
 */
export function validarDentroDeHorario(fecha: string): string | null {
  const match = fecha.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  if (!match) return "Formato de fecha inválido.";

  const [, fechaSolo, horaStr, minStr] = match;
  const diaSemana = new Date(`${fechaSolo}T00:00:00Z`).getUTCDay();
  const horario = HORARIOS[diaSemana];
  if (!horario) return "Ese día no hay servicio.";

  const horaDecimal = Number(horaStr) + Number(minStr) / 60;
  if (horaDecimal < horario.abre || horaDecimal >= horario.cierra) {
    return "Ese horario está fuera del horario de atención.";
  }
  return null;
}
