"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAdminToken } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo iniciar sesión.");
        return;
      }

      const { token } = await res.json();
      saveAdminToken(token);
      router.push("/admin");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[#2E3E4F]/20 p-8 space-y-6"
      >
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-rapha-barber.svg" alt="Rapha Barber Studio" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="font-display text-3xl text-white tracking-wide">ADMINISTRACIÓN</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-[#9CA3AF]/30 text-white px-4 py-2 focus:outline-none focus:border-[#7C97B2]"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-[#7C97B2] text-[#7C97B2] px-6 py-3 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
