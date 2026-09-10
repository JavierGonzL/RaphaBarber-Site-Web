import Link from "next/link";

const redes = [
  { href: "https://instagram.com/", label: "Instagram" },
  { href: "https://www.tiktok.com/@rapha.barber.stud?is_from_webapp=1&sender_device=pc", label: "TikTok" },
  { href: "https://facebook.com/", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2E3E4F]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rapha-wordmark.svg" alt="Rapha" className="h-8 w-auto -mt-1" />
            <span className="font-display text-3xl text-white tracking-widest leading-none">BARBER</span>
          </div>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            El corte que los campeones eligen.<br />
            La experiencia que mereces.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Navegación</p>
          <ul className="space-y-2">
            {["Servicios", "Nosotros", "Galería", "Dinámicas", "Contacto"].map((item) => (
              <li key={item}>
                <Link
                  href={`/#${item.toLowerCase().replace("í", "i")}`}
                  className="text-sm text-[#9CA3AF] hover:text-[#7C97B2] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Redes Sociales</p>
          <ul className="space-y-2">
            {redes.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#9CA3AF] hover:text-[#7C97B2] transition-colors"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#2E3E4F]/10 py-4 text-center text-xs text-[#9CA3AF]">
        © {new Date().getFullYear()} RaphaBarber. Todos los derechos reservados.
      </div>
    </footer>
  );
}
