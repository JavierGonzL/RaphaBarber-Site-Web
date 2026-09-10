import { Scissors, GraduationCap, Heart } from "lucide-react";

const dinamicas = [
  {
    icono: Scissors,
    titulo: "Gana tu corte gratis",
    descripcion:
      "Participamos en dinámicas en redes sociales donde puedes ganar servicios de barbería completamente gratis. Síguenos y no pierdas ninguna.",
  },
  {
    icono: GraduationCap,
    titulo: "Cursos de barbería",
    descripcion:
      "¿Quieres aprender el oficio? Ofrecemos cursos presenciales para quienes sueñan con convertirse en barberos profesionales.",
  },
  {
    icono: Heart,
    titulo: "Apoyo social",
    descripcion:
      "Realizamos colectas y rifas para apoyar a personas con necesidades especiales. Porque una barbería también puede cambiar vidas.",
  },
];

export default function Dinamicas() {
  return (
    <section id="dinamicas" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Más que un corte</p>
          <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">
            DINÁMICAS Y <span className="text-[#7C97B2]">COMUNIDAD</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2E3E4F]/10">
          {dinamicas.map((d) => (
            <div key={d.titulo} className="bg-[#0A0A0A] p-10 text-center hover:bg-[#000000] transition-colors">
              <d.icono className="w-10 h-10 mb-6 mx-auto text-[#7C97B2]" strokeWidth={1.5} />
              <h3 className="font-display text-2xl text-white tracking-wide mb-4">{d.titulo}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{d.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Sección Pachuca highlight */}
        <div className="mt-16 border border-[#7C97B2]/40 bg-[#2E3E4F]/5 p-10 md:p-16 text-center">
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Orgullo Tuzo</p>
          <h3 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-6">
            LA BARBERÍA QUE<br />
            <span className="text-[#7C97B2]">LOS TUZOS ELIGEN</span>
          </h3>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed mb-8">
            Nuestras paredes están decoradas con playeras, balones y fotografías firmadas por
            los jugadores del Club Pachuca. Ven a conocerlos y siente la magia del fútbol en
            cada visita.
          </p>
          <div className="inline-flex items-center gap-3 text-[#7C97B2] text-sm uppercase tracking-widest">
            <span className="w-8 h-px bg-[#2E3E4F]" />
            Artículos firmados en exhibición
            <span className="w-8 h-px bg-[#2E3E4F]" />
          </div>
        </div>
      </div>
    </section>
  );
}
