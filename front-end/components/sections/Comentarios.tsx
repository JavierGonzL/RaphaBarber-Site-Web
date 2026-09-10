type Testimonio = {
  id: string;
  nombre: string;
  texto: string;
  califica: number;
};

async function getTestimonios(): Promise<Testimonio[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonios`);
  if (!res.ok) return [];
  return res.json();
}

export default async function Comentarios() {
  const testimonios = await getTestimonios();
  if (testimonios.length === 0) return null;

  return (
    <section id="comentarios" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Lo que dicen de nosotros</p>
          <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">COMENTARIOS</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-px bg-[#000000]">
          {testimonios.map((t) => (
            <div
              key={t.id}
              className="w-full md:w-[calc(50%-0.5px)] lg:w-[calc(33.333%-0.667px)] bg-[#000000] p-8"
            >
              <p className="text-[#7C97B2] text-sm mb-4">{"★".repeat(t.califica)}</p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">&ldquo;{t.texto}&rdquo;</p>
              <p className="text-white text-sm font-semibold">{t.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
