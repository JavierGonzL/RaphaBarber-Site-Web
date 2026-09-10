"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { adminCreate, adminDelete, adminUpdate, useAdminResource } from "@/lib/adminApi";

type Video = {
  id: string;
  titulo: string;
  urlTiktok: string;
  etiqueta: string | null;
  activo: boolean;
  orden: number;
};

const inputClass =
  "w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]";
const labelClass = "block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2";

export default function VideosAdminPage() {
  const { items, loading, error, refresh } = useAdminResource<Video>("/admin/videos");

  const [titulo, setTitulo] = useState("");
  const [urlTiktok, setUrlTiktok] = useState("");
  const [etiqueta, setEtiqueta] = useState("Corte del mes");
  const [orden, setOrden] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await adminCreate("/admin/videos", { titulo, urlTiktok, etiqueta: etiqueta || undefined, orden });
      setTitulo("");
      setUrlTiktok("");
      setOrden(0);
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(video: Video) {
    await adminUpdate(`/admin/videos/${video.id}`, { activo: !video.activo });
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este video?")) return;
    await adminDelete(`/admin/videos/${id}`);
    refresh();
  }

  return (
    <AdminGuard>
      <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Panel</p>
      <h1 className="font-display text-4xl text-white tracking-wide mb-10">CORTE DEL MES</h1>

      <form onSubmit={handleSubmit} className="border border-[#2E3E4F]/20 p-6 space-y-4 mb-12">
        <div>
          <label className={labelClass}>Título</label>
          <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>URL de TikTok</label>
          <input
            required
            type="url"
            placeholder="https://www.tiktok.com/@rapha_barber_studio/video/..."
            value={urlTiktok}
            onChange={(e) => setUrlTiktok(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Etiqueta</label>
            <input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Orden</label>
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
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
          {saving ? "Guardando..." : "Agregar video"}
        </button>
      </form>

      {loading && <p className="text-[#9CA3AF] text-sm">Cargando...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="space-y-px bg-[#2E3E4F]/10">
        {items.map((video) => (
          <div key={video.id} className="bg-[#000000] p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">{video.titulo}</h3>
              <p className="text-[#9CA3AF] text-sm mt-1 break-all">{video.urlTiktok}</p>
              {video.etiqueta && <p className="text-[#7C97B2] text-xs mt-1 uppercase tracking-widest">{video.etiqueta}</p>}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleActivo(video)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 border ${
                  video.activo ? "border-[#7C97B2] text-[#7C97B2]" : "border-[#9CA3AF]/30 text-[#9CA3AF]"
                }`}
              >
                {video.activo ? "Activo" : "Inactivo"}
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="text-xs uppercase tracking-widest px-3 py-1.5 border border-red-400/40 text-red-400 hover:bg-red-400/10"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="bg-[#000000] p-5 text-[#9CA3AF] text-sm">Todavía no hay videos.</p>
        )}
      </div>
    </AdminGuard>
  );
}
