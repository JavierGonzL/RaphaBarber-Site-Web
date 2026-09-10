"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { adminCreate, adminDelete, adminUpdate, useAdminResource } from "@/lib/adminApi";

type Testimonio = {
  id: string;
  nombre: string;
  texto: string;
  califica: number;
  aprobado: boolean;
};

const inputClass =
  "w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]";
const labelClass = "block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2";

export default function ComentariosAdminPage() {
  const { items, loading, error, refresh } = useAdminResource<Testimonio>("/admin/testimonios");

  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [califica, setCalifica] = useState(5);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await adminCreate("/admin/testimonios", { nombre, texto, califica, aprobado: true });
      setNombre("");
      setTexto("");
      setCalifica(5);
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAprobado(t: Testimonio) {
    await adminUpdate(`/admin/testimonios/${t.id}`, { aprobado: !t.aprobado });
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este comentario?")) return;
    await adminDelete(`/admin/testimonios/${id}`);
    refresh();
  }

  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Panel</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-3">COMENTARIOS</h1>
      <p className="text-[#9CA3AF] text-sm mb-10">
        Copia aquí las reseñas que quieras destacar desde{" "}
        <a
          href="https://maps.app.goo.gl/8CEsxQ4U2qxQpsbDA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7C97B2] underline"
        >
          la ficha de Google
        </a>
        . Solo las aprobadas se muestran en el sitio.
      </p>

      <form onSubmit={handleSubmit} className="border border-[#2E3E4F]/20 p-6 space-y-4 mb-12">
        <div>
          <label className={labelClass}>Nombre del cliente</label>
          <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Texto de la reseña</label>
          <textarea
            required
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className={inputClass}
            rows={3}
          />
        </div>
        <div>
          <label className={labelClass}>Calificación</label>
          <select
            value={califica}
            onChange={(e) => setCalifica(Number(e.target.value))}
            className={inputClass}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrella{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={saving}
          className="border border-[#7C97B2] text-[#7C97B2] px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Agregar comentario"}
        </button>
      </form>

      {loading && <p className="text-[#9CA3AF] text-sm">Cargando...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="space-y-px bg-[#2E3E4F]/10">
        {items.map((t) => (
          <div key={t.id} className="bg-[#000000] p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">
                {t.nombre} <span className="text-[#7C97B2] text-sm">{"★".repeat(t.califica)}</span>
              </h3>
              <p className="text-[#9CA3AF] text-sm mt-1">{t.texto}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAprobado(t)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border ${
                  t.aprobado ? "border-[#7C97B2] text-[#7C97B2]" : "border-[#9CA3AF]/30 text-[#9CA3AF]"
                }`}
              >
                {t.aprobado ? "Visible" : "Oculto"}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-xs uppercase tracking-widest px-3 py-1.5 border border-red-400/40 text-red-400 hover:bg-red-400/10"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="bg-[#000000] p-5 text-[#9CA3AF] text-sm">Todavía no hay comentarios.</p>
        )}
      </div>
    </AdminGuard>
  );
}
