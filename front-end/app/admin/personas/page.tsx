"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminCreate, adminDelete, useAdminResource } from "@/lib/adminApi";

type Persona = {
  id: string;
  nombre: string;
  cargo: string | null;
  fotoUrl: string;
};

const inputClass =
  "w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]";
const labelClass = "block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2";

export default function PersonasAdminPage() {
  const { items, loading, error, refresh } = useAdminResource<Persona>("/admin/personas");

  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fotoUrl) {
      setFormError("Sube una foto antes de guardar.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      await adminCreate("/admin/personas", { nombre, cargo: cargo || undefined, fotoUrl });
      setNombre("");
      setCargo("");
      setFotoUrl("");
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar a esta persona?")) return;
    await adminDelete(`/admin/personas/${id}`);
    refresh();
  }

  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Panel</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-10">PERSONAS RECONOCIDAS</h1>

      <form onSubmit={handleSubmit} className="border border-[#2E3E4F]/20 p-6 space-y-4 mb-12">
        <div>
          <label className={labelClass}>Nombre</label>
          <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cargo (opcional)</label>
          <input
            placeholder="Jugador · Club Pachuca"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={inputClass}
          />
        </div>
        <ImageUploadField label="Foto" value={fotoUrl} onChange={setFotoUrl} />
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={saving}
          className="border border-[#7C97B2] text-[#7C97B2] px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Agregar persona"}
        </button>
      </form>

      {loading && <p className="text-[#9CA3AF] text-sm">Cargando...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#2E3E4F]/10">
        {items.map((persona) => (
          <div key={persona.id} className="bg-[#000000] p-5 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={persona.fotoUrl}
              alt=""
              className="w-14 h-14 object-cover border border-[#9CA3AF]/30 shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">{persona.nombre}</h3>
              {persona.cargo && <p className="text-[#9CA3AF] text-sm">{persona.cargo}</p>}
            </div>
            <button
              onClick={() => handleDelete(persona.id)}
              className="text-xs uppercase tracking-widest px-3 py-1.5 border border-red-400/40 text-red-400 hover:bg-red-400/10 shrink-0"
            >
              Eliminar
            </button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="bg-[#000000] p-5 text-[#9CA3AF] text-sm">Todavía no hay personas agregadas.</p>
        )}
      </div>
    </AdminGuard>
  );
}
