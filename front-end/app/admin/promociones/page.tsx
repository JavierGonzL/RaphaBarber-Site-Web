"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminCreate, adminDelete, adminUpdate, useAdminResource } from "@/lib/adminApi";

type Promocion = {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  vigenciaInicio: string | null;
  vigenciaFin: string | null;
  activa: boolean;
};

const inputClass =
  "w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]";
const labelClass = "block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2";

export default function PromocionesAdminPage() {
  const { items, loading, error, refresh } = useAdminResource<Promocion>("/admin/promociones");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [vigenciaInicio, setVigenciaInicio] = useState("");
  const [vigenciaFin, setVigenciaFin] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await adminCreate("/admin/promociones", {
        titulo,
        descripcion,
        imagenUrl: imagenUrl || undefined,
        vigenciaInicio: vigenciaInicio ? new Date(vigenciaInicio).toISOString() : undefined,
        vigenciaFin: vigenciaFin ? new Date(vigenciaFin).toISOString() : undefined,
      });
      setTitulo("");
      setDescripcion("");
      setImagenUrl("");
      setVigenciaInicio("");
      setVigenciaFin("");
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(promo: Promocion) {
    await adminUpdate(`/admin/promociones/${promo.id}`, { activa: !promo.activa });
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta promoción?")) return;
    await adminDelete(`/admin/promociones/${id}`);
    refresh();
  }

  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Panel</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-10">PROMOCIONES</h1>

      <form onSubmit={handleSubmit} className="border border-[#2E3E4F]/20 p-6 space-y-4 mb-12">
        <div>
          <label className={labelClass}>Título</label>
          <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={inputClass}
            rows={3}
          />
        </div>
        <ImageUploadField label="Imagen (opcional)" value={imagenUrl} onChange={setImagenUrl} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vigente desde</label>
            <input
              type="date"
              value={vigenciaInicio}
              onChange={(e) => setVigenciaInicio(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Vigente hasta</label>
            <input
              type="date"
              value={vigenciaFin}
              onChange={(e) => setVigenciaFin(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={saving}
          className="border border-[#7C97B2] text-[#7C97B2] px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Agregar promoción"}
        </button>
      </form>

      {loading && <p className="text-[#9CA3AF] text-sm">Cargando...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="space-y-px bg-[#2E3E4F]/10">
        {items.map((promo) => (
          <div key={promo.id} className="bg-[#000000] p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">{promo.titulo}</h3>
              <p className="text-[#9CA3AF] text-sm mt-1">{promo.descripcion}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleActiva(promo)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border ${
                  promo.activa ? "border-[#7C97B2] text-[#7C97B2]" : "border-[#9CA3AF]/30 text-[#9CA3AF]"
                }`}
              >
                {promo.activa ? "Activa" : "Inactiva"}
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="text-xs uppercase tracking-widest px-3 py-1.5 border border-red-400/40 text-red-400 hover:bg-red-400/10"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="bg-[#000000] p-5 text-[#9CA3AF] text-sm">Todavía no hay promociones.</p>
        )}
      </div>
    </AdminGuard>
  );
}
