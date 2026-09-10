import Image from "next/image";

export default function Nosotros() {
  return (
    <section id="nosotros" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Foto de la barberia */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-[#2E3E4F]/20">
              <Image
                src="/images/barberia%20.png"
                alt="Interior de RaphaBarber"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Tarjeta decorativa */}
            <div className="absolute -bottom-6 -right-6 bg-[#2E3E4F] p-6 hidden md:block">
              <p className="font-display text-4xl text-white leading-none">+5</p>
              <p className="text-white/80 text-xs uppercase tracking-wider mt-1">años de experiencia</p>
            </div>
          </div>

          {/* Contenido */}
          <div>
            <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Nuestra historia</p>
            <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide mb-8">
              MÁS QUE<br />
              <span className="text-[#7C97B2]">UNA BARBERÍA</span>
            </h2>

            <p className="text-[#9CA3AF] leading-relaxed mb-6">
              RaphaBarber nació con una visión simple: que cada cliente salga sintiéndose como
              un campeón. Eso nos llevó a convertirnos en la barbería de confianza de los
              futbolistas del <span className="text-[#7C97B2]">Club Pachuca</span>, quienes nos
              eligen antes de cada partido.
            </p>

            <p className="text-[#9CA3AF] leading-relaxed mb-10">
              Cada visita es única: te recibimos con agua, jugo, refresco o cerveza mientras
              disfrutas de artículos firmados por tus jugadores favoritos que adornan el espacio.
              Aquí no solo te cortamos el cabello, te hacemos parte de la familia.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { valor: "Pachuca", desc: "Equipo de casa" },
                { valor: "Gratis", desc: "Gana servicios en dinámicas" },
                { valor: "Cursos", desc: "Forma tu carrera" },
                { valor: "Comunidad", desc: "Apoyamos causas sociales" },
              ].map((h) => (
                <div key={h.desc} className="border-l-2 border-[#7C97B2] pl-4">
                  <p className="font-display text-2xl text-[#7C97B2]">{h.valor}</p>
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
