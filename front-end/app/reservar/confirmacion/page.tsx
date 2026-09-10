"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type EstadoReserva = {
  id: string;
  estado: string;
  servicio: string;
  fecha: string;
};

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_INTENTOS = 20; // ~1 minuto

export default function ConfirmacionReservaPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacionReserva />
    </Suspense>
  );
}

function ConfirmacionReserva() {
  const searchParams = useSearchParams();
  const citaId = searchParams.get("cita");

  const [reserva, setReserva] = useState<EstadoReserva | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!citaId) {
      setError("Falta el identificador de la reserva.");
      return;
    }

    let cancelado = false;

    async function consultar() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservas/${citaId}`);
        if (!res.ok) {
          if (!cancelado) setError("No se encontró la reserva.");
          return;
        }
        const data: EstadoReserva = await res.json();
        if (!cancelado) setReserva(data);
      } catch {
        if (!cancelado) setError("No se pudo conectar con el servidor.");
      }
    }

    consultar();
    const interval = setInterval(() => {
      setIntentos((n) => n + 1);
      consultar();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelado = true;
      clearInterval(interval);
    };
  }, [citaId]);

  const agotado = intentos >= POLL_MAX_INTENTOS;

  return (
    <main className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {error && (
          <>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Reserva</p>
            <h1 className="font-display text-4xl text-white tracking-wide mb-6">ALGO SALIÓ MAL</h1>
            <p className="text-[#9CA3AF] mb-8">{error}</p>
          </>
        )}

        {!error && reserva?.estado === "confirmada" && (
          <>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Pago aprobado</p>
            <h1 className="font-display text-4xl text-white tracking-wide mb-6">TE ESPERAMOS</h1>
            <p className="text-[#9CA3AF] mb-2">
              <span className="text-white">{reserva.servicio}</span>
            </p>
            <p className="text-[#9CA3AF] mb-8">
              {new Date(reserva.fecha).toLocaleString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Mexico_City",
              })}
            </p>
          </>
        )}

        {!error && reserva?.estado === "cancelada" && (
          <>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Pago no completado</p>
            <h1 className="font-display text-4xl text-white tracking-wide mb-6">NO SE PUDO CONFIRMAR</h1>
            <p className="text-[#9CA3AF] mb-8">
              El pago no se completó y el horario quedó libre de nuevo. Puedes intentar reservar otra vez.
            </p>
          </>
        )}

        {!error && reserva?.estado === "pendiente_pago" && !agotado && (
          <>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Procesando</p>
            <h1 className="font-display text-4xl text-white tracking-wide mb-6">CONFIRMANDO TU PAGO</h1>
            <p className="text-[#9CA3AF] mb-8">
              Esto puede tardar unos segundos. No cierres esta ventana.
            </p>
          </>
        )}

        {!error && reserva?.estado === "pendiente_pago" && agotado && (
          <>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Sigue en proceso</p>
            <h1 className="font-display text-4xl text-white tracking-wide mb-6">TU PAGO SIGUE EN REVISIÓN</h1>
            <p className="text-[#9CA3AF] mb-8">
              Mercado Pago sigue procesando tu pago. En cuanto se confirme, tu cita queda agendada — no hace falta
              que hagas nada más. Si tienes dudas, contáctanos por WhatsApp.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block border border-[#7C97B2] text-[#7C97B2] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
