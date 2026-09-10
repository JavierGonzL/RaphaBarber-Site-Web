"use client";

import { useState } from "react";
import { adminUpload } from "@/lib/adminApi";

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await adminUpload(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="w-16 h-16 object-cover border border-[#9CA3AF]/30"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm text-[#9CA3AF] file:mr-4 file:border file:border-[#9CA3AF]/30 file:bg-transparent file:text-[#7C97B2] file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-widest"
        />
      </div>
      {uploading && <p className="text-xs text-[#9CA3AF] mt-2">Subiendo...</p>}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
