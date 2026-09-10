"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, clearAdminToken, getAdminToken } from "@/lib/adminAuth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    adminFetch("/admin/me").then((res) => {
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  function handleLogout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#000000] flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Verificando sesión...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="border-b border-[#2E3E4F]/20 px-6 py-4 flex items-center justify-between">
        <a href="/admin" className="text-xs text-[#7C97B2] uppercase tracking-widest">
          ← Panel de administración
        </a>
        <button
          onClick={handleLogout}
          className="border border-[#9CA3AF]/30 text-[#9CA3AF] px-4 py-1.5 text-xs uppercase tracking-widest hover:border-[#7C97B2] hover:text-[#7C97B2] transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="px-6 py-12 max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
