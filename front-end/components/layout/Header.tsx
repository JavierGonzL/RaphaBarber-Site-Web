"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#dinamicas", label: "Dinámicas" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#000000]/90 backdrop-blur-sm border-b border-[#2E3E4F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rapha-wordmark.svg" alt="Rapha" className="h-6 w-auto -mt-1" />
          <span className="font-display text-2xl text-white tracking-widest">BARBER</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[#9CA3AF] hover:text-[#7C97B2] transition-colors tracking-wide uppercase"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            className="bg-[#2E3E4F] text-white text-sm font-semibold px-4 py-2 hover:bg-[#3E5570] transition-colors"
          >
            Reservar
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#7C97B2]"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#000000] border-t border-[#2E3E4F]/20 px-4 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[#9CA3AF] hover:text-[#7C97B2] transition-colors tracking-wide uppercase text-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="bg-[#2E3E4F] text-white text-sm font-semibold px-4 py-3 text-center hover:bg-[#3E5570] transition-colors"
          >
            Reservar
          </Link>
        </div>
      )}
    </header>
  );
}
