type Promocion = {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
};

async function getPromociones(): Promise<Promocion[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promociones`);
  if (!res.ok) return [];
  return res.json();
}

export default async function Promociones() {
  const promociones = await getPromociones();
  if (promociones.length === 0) return null;

  return (
    <section id="promociones" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">No te lo pierdas</p>
          <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">
            PROMOCIONES <span className="text-[#7C97B2]">ACTIVAS</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-px bg-[#0A0A0A]">
          {promociones.map((p) => (
            <div
              key={p.id}
              className="w-full md:w-[calc(50%-0.5px)] lg:w-[calc(33.333%-0.667px)] bg-[#0A0A0A] p-8"
            >
              {p.imagenUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imagenUrl}
                  alt={p.titulo}
                  className="w-full h-40 object-cover mb-5"
                />
              )}
              <h3 className="font-display text-2xl text-white tracking-wide mb-2">{p.titulo}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{p.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
