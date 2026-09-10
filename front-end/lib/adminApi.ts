"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "./adminAuth";

export function useAdminResource<T>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch(path);
      if (!res.ok) throw new Error("No se pudo cargar la información.");
      setItems(await res.json());
    } catch {
      setError("No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}

export async function adminCreate(path: string, body: unknown) {
  const res = await adminFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "No se pudo guardar.");
  }
  return res.json();
}

export async function adminUpdate(path: string, body: unknown) {
  const res = await adminFetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "No se pudo actualizar.");
  }
  return res.json();
}

export async function adminDelete(path: string) {
  const res = await adminFetch(path, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "No se pudo eliminar.");
  }
}

export async function adminUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await adminFetch("/admin/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "No se pudo subir la imagen.");
  }
  const data = await res.json();
  return data.url as string;
}
