"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { hoyLocal, OFFSET_LOCAL } from "@/lib/horario";
import { useDisponibilidad } from "@/lib/useDisponibilidad";

type Servicio = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
};

const inputClass =
  "w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]";
const labelClass = "block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2";

export default function CitasAdminPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState(hoyLocal());
  const [hora, setHora] = useState<string | null>(null);
  const { slots, ocupados, cargando: cargandoSlots, marcarOcupado } = useDisponibilidad(fecha);

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [notas, setNotas] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios`)
      .then((res) => res.json())
      .then((data: Servicio[]) => {
        setServicios(data);
        if (data.length > 0) setServicioId(data[0].id);
      });
  }, []);

  useEffect(() => {
    setHora(null);
  }, [fecha]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!servicioId || !hora) return;
    setError(null);
    setExito(null);
    setEnviando(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre,
          clienteTelefono,
          servicioId,
          fecha: `${fecha}T${hora}:00${OFFSET_LOCAL}`,
          notas: notas || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo registrar la cita.");
        if (res.status === 409) marcarOcupado(hora);
        return;
      }

      setExito(`Cita registrada: ${clienteNombre} — ${fecha} ${hora}`);
      setClienteNombre("");
      setClienteTelefono("");
      setNotas("");
      setHora(null);
      marcarOcupado(hora);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Panel</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-3">CITAS POR WHATSAPP</h1>
      <p className="text-[#9CA3AF] text-sm mb-10">
        Cuando acuerdes una cita por WhatsApp, regístrala aquí — se guarda igual que una reserva del sitio y se
        sincroniza sola con tu Google Calendar.
      </p>

      <form onSubmit={handleSubmit} className="border border-[#2E3E4F]/20 p-6 space-y-6">
        <div>
          <label className={labelClass}>Servicio</label>
          <select value={servicioId} onChange={(e) => setServicioId(e.target.value)} className={inputClass}>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} — ${s.precio} ({s.duracion} min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            min={hoyLocal()}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Horario</label>
          {cargandoSlots && <p className="text-[#9CA3AF] text-sm">Cargando horarios...</p>}
          {!cargandoSlots && slots.length === 0 && (
            <p className="text-[#9CA3AF] text-sm">No hay horarios disponibles ese día.</p>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {!cargandoSlots &&
              slots.map((s) => {
                const tomado = ocupados.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={tomado}
                    onClick={() => setHora(s)}
                    className={`py-2 text-sm border transition-colors ${
                      tomado
                        ? "border-[#9CA3AF]/10 text-[#9CA3AF]/30 cursor-not-allowed"
                        : hora === s
                        ? "border-[#7C97B2] bg-[#2E3E4F] text-white"
                        : "border-[#9CA3AF]/30 text-[#9CA3AF] hover:border-[#7C97B2] hover:text-[#7C97B2]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
          </div>
        </div>

        <div>
          <label className={labelClass}>Nombre del cliente</label>
          <input
            required
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Teléfono / WhatsApp</label>
          <input
            required
            type="tel"
            value={clienteTelefono}
            onChange={(e) => setClienteTelefono(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Notas (opcional)</label>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} className={inputClass} rows={2} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {exito && <p className="text-sm text-[#7C97B2]">{exito}</p>}

        <button
          type="submit"
          disabled={!servicioId || !hora || enviando}
          className="border border-[#7C97B2] text-[#7C97B2] px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {enviando ? "Registrando..." : "Registrar cita"}
        </button>
      </form>
    </AdminGuard>
  );
}
