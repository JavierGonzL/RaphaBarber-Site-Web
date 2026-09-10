"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { adminFetch, getAdminToken } from "@/lib/adminAuth";

const secciones = [
  { href: "/admin/citas", titulo: "Citas por WhatsApp", descripcion: "Registra a mano lo acordado por WhatsApp; se sincroniza igual que una reserva del sitio." },
  { href: "/admin/promociones", titulo: "Promociones", descripcion: "Ofertas y avisos que se muestran en la home." },
  { href: "/admin/videos", titulo: "Corte del mes", descripcion: "Videos de TikTok destacados." },
  { href: "/admin/personas", titulo: "Personas reconocidas", descripcion: "Fotos de jugadores y personalidades que se han cortado aquí." },
  { href: "/admin/comentarios", titulo: "Comentarios", descripcion: "Reseñas curadas manualmente desde Google." },
];

type EstadoGoogle = { conectado: boolean; cuentaEmail: string | null };

function GoogleCalendarCard() {
  const [estado, setEstado] = useState<EstadoGoogle | null>(null);
  const [desconectando, setDesconectando] = useState(false);

  async function cargarEstado() {
    const res = await adminFetch("/admin/google/estado");
    if (res.ok) setEstado(await res.json());
  }

  useEffect(() => {
    cargarEstado();
  }, []);

  function conectar() {
    const token = getAdminToken();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?token=${encodeURIComponent(token ?? "")}`;
  }

  async function desconectar() {
    if (!confirm("¿Desconectar Google Calendar? Las citas nuevas dejarán de sincronizarse.")) return;
    setDesconectando(true);
    await adminFetch("/admin/google", { method: "DELETE" });
    await cargarEstado();
    setDesconectando(false);
  }

  return (
    <div className="border border-[#2E3E4F]/20 p-8 mb-10">
      <h2 className="font-display text-2xl text-white tracking-wide mb-2">GOOGLE CALENDAR</h2>
      {estado === null && <p className="text-[#9CA3AF] text-sm">Verificando conexión...</p>}
      {estado?.conectado && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-[#9CA3AF] text-sm">
            Conectado como <span className="text-white">{estado.cuentaEmail}</span>
          </p>
          <button
            onClick={desconectar}
            disabled={desconectando}
            className="text-xs uppercase tracking-widest px-4 py-2 border border-red-400/40 text-red-400 hover:bg-red-400/10 disabled:opacity-50"
          >
            {desconectando ? "Desconectando..." : "Desconectar"}
          </button>
        </div>
      )}
      {estado && !estado.conectado && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-[#9CA3AF] text-sm">Ninguna cuenta conectada todavía.</p>
          <button
            onClick={conectar}
            className="border border-[#7C97B2] text-[#7C97B2] px-5 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors"
          >
            Conectar Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Rapha Barber</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-10">PANEL DE ADMINISTRACIÓN</h1>

      <GoogleCalendarCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#2E3E4F]/10">
        {secciones.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-[#000000] p-8 hover:bg-[#111] transition-colors group"
          >
            <h2 className="font-display text-2xl text-white tracking-wide group-hover:text-[#7C97B2] transition-colors mb-2">
              {s.titulo}
            </h2>
            <p className="text-[#9CA3AF] text-sm">{s.descripcion}</p>
          </Link>
        ))}
      </div>
    </AdminGuard>
  );
}
