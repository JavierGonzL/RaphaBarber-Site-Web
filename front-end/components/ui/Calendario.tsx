"use client";

import { useState } from "react";
import { HORARIOS, hoyLocal } from "@/lib/horario";

type CalendarioProps = {
  /** Fecha seleccionada, "YYYY-MM-DD". */
  value: string;
  onChange: (fecha: string) => void;
};

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"];

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Día de la semana (0=domingo) de una fecha "YYYY-MM-DD", sin corrimientos por huso horario. */
function diaSemanaDe(fechaISO: string): number {
  return new Date(`${fechaISO}T00:00:00Z`).getUTCDay();
}

export function Calendario({ value, onChange }: CalendarioProps) {
  const hoy = hoyLocal();
  const hoyYear = Number(hoy.slice(0, 4));
  const hoyMonth = Number(hoy.slice(5, 7)) - 1;

  const valorYear = Number(value.slice(0, 4));
  const valorMonth = Number(value.slice(5, 7)) - 1;

  const [cursor, setCursor] = useState({ year: valorYear, month: valorMonth });

  const diasEnMes = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const offset = new Date(cursor.year, cursor.month, 1).getDay();

  const puedeRetroceder = cursor.year > hoyYear || (cursor.year === hoyYear && cursor.month > hoyMonth);

  function irMesAnterior() {
    if (!puedeRetroceder) return;
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  }
  function irMesSiguiente() {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  }

  const celdas: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  return (
    <div className="border border-[#9CA3AF]/30 bg-[#000000] p-4 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={irMesAnterior}
          disabled={!puedeRetroceder}
          className="text-[#9CA3AF] hover:text-[#7C97B2] disabled:opacity-20 disabled:cursor-not-allowed px-2 py-1"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="text-sm text-white tracking-widest uppercase">
          {MESES[cursor.month]} {cursor.year}
        </p>
        <button
          type="button"
          onClick={irMesSiguiente}
          className="text-[#9CA3AF] hover:text-[#7C97B2] px-2 py-1"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-[#9CA3AF]/60 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`v-${i}`} />;

          const fechaISO = toISODate(cursor.year, cursor.month, dia);
          const cerrado = HORARIOS[diaSemanaDe(fechaISO)] === null;
          const esPasado = fechaISO < hoy;
          const deshabilitado = cerrado || esPasado;
          const esHoy = fechaISO === hoy;
          const esSeleccionado = fechaISO === value;

          return (
            <button
              key={fechaISO}
              type="button"
              disabled={deshabilitado}
              onClick={() => onChange(fechaISO)}
              className={`aspect-square text-sm border transition-colors ${
                esSeleccionado
                  ? "border-[#7C97B2] bg-[#2E3E4F] text-white"
                  : deshabilitado
                  ? "border-transparent text-[#9CA3AF]/25 cursor-not-allowed"
                  : esHoy
                  ? "border-[#7C97B2]/60 text-[#7C97B2] hover:bg-[#2E3E4F]/40"
                  : "border-transparent text-[#9CA3AF] hover:border-[#7C97B2] hover:text-[#7C97B2]"
              }`}
            >
              {dia}
            </button>
          );
        })}
      </div>
    </div>
  );
}
