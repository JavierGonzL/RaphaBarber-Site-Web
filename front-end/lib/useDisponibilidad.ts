"use client";

import { useEffect, useState } from "react";
import { generarSlots, horaLocalDesdeISO, hoyLocal } from "./horario";

/** Slots disponibles para una fecha "YYYY-MM-DD": ya filtra ocupados y horas pasadas si es hoy. */
export function useDisponibilidad(fecha: string) {
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas?fecha=${fecha}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((citas: { fecha: string }[]) => {
        setOcupados(new Set(citas.map((c) => horaLocalDesdeISO(c.fecha))));
      })
      .finally(() => setCargando(false));
  }, [fecha]);

  const todosLosSlots = generarSlots(fecha);
  const esHoy = fecha === hoyLocal();
  const horaActual = esHoy
    ? new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "America/Mexico_City" })
    : null;
  const slots = todosLosSlots.filter((s) => !esHoy || !horaActual || s > horaActual);

  function marcarOcupado(hora: string) {
    setOcupados((prev) => new Set(prev).add(hora));
  }

  return { slots, ocupados, cargando, marcarOcupado };
}
