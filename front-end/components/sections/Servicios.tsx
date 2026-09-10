type Servicio = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion: number;
  categoria: string;
};

async function getServicios(): Promise<Servicio[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios`);
  if (!res.ok) throw new Error("No se pudieron cargar los servicios");
  return res.json();
}

function agruparPorCategoria(servicios: Servicio[]) {
  const grupos = new Map<string, Servicio[]>();
  for (const s of servicios) {
    const grupo = grupos.get(s.categoria) ?? [];
    grupo.push(s);
    grupos.set(s.categoria, grupo);
  }
  return Array.from(grupos, ([categoria, items]) => ({ categoria, items }));
}

export default async function Servicios() {
  const servicios = agruparPorCategoria(await getServicios());
  return (
    <section id="servicios" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header sección */}
      <div className="mb-16 flex items-end justify-between">
        <div>
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Lo que hacemos</p>
          <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">
            NUESTROS <span className="text-[#7C97B2]">SERVICIOS</span>
          </h2>
        </div>
      </div>

      {/* Grid de categorías */}
      <div className="space-y-16">
        {servicios.map((cat) => (
          <div key={cat.categoria}>
            <p className="text-sm text-[#9CA3AF] uppercase tracking-widest mb-6 border-b border-[#2E3E4F]/20 pb-3">
              {cat.categoria}
            </p>
            <div className="flex flex-wrap gap-px bg-[#000000]">
              {cat.items.map((s) => (
                <div
                  key={s.nombre}
                  className="w-full md:w-[calc(50%-0.5px)] lg:w-[calc(33.333%-0.667px)] bg-[#000000] p-8 hover:bg-[#111] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-2xl text-white tracking-wide group-hover:text-[#7C97B2] transition-colors">
                      {s.nombre}
                    </h3>
                    <span className="text-[#7C97B2] font-semibold text-lg">${s.precio}</span>
                  </div>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">{s.descripcion}</p>
                  <p className="text-xs text-[#9CA3AF]/60 uppercase tracking-widest">{s.duracion} min</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <a
          href="https://wa.me/521XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#7C97B2] text-[#7C97B2] px-10 py-4 text-sm tracking-widest uppercase hover:bg-[#2E3E4F] hover:text-white transition-colors"
        >
          Reservar por WhatsApp
        </a>
      </div>
    </section>
  );
}
