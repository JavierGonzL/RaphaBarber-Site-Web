import Script from "next/script";

type Video = {
  id: string;
  titulo: string;
  urlTiktok: string;
  etiqueta: string | null;
};

type Persona = {
  id: string;
  nombre: string;
  cargo: string | null;
  fotoUrl: string;
};

async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  if (!res.ok) return [];
  return res.json();
}

async function getPersonas(): Promise<Persona[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personas`);
  if (!res.ok) return [];
  return res.json();
}

function extraerVideoId(url: string): string | undefined {
  return url.match(/\/video\/(\d+)/)?.[1];
}

export default async function Galeria() {
  const [videos, personas] = await Promise.all([getVideos(), getPersonas()]);
  if (videos.length === 0 && personas.length === 0) return null;

  return (
    <section id="galeria" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {videos.length > 0 && (
          <div>
            <div className="mb-12">
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">En cámara</p>
              <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">
                CORTE DEL <span className="text-[#7C97B2]">MES</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] rounded-2xl border border-[#2E3E4F]/40 bg-black p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
                >
                  <blockquote
                    className="tiktok-embed"
                    cite={v.urlTiktok}
                    data-video-id={extraerVideoId(v.urlTiktok)}
                    style={{ maxWidth: "100%", minWidth: "260px" }}
                  >
                    <section>
                      <a href={v.urlTiktok} target="_blank" rel="noopener noreferrer">
                        {v.titulo}
                      </a>
                    </section>
                  </blockquote>
                </div>
              ))}
            </div>
            <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
          </div>
        )}

        {personas.length > 0 && (
          <div>
            <div className="mb-12">
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Orgullo Tuzo</p>
              <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide">
                PERSONAS <span className="text-[#7C97B2]">RECONOCIDAS</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-px bg-[#0A0A0A]">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className="w-[calc(50%-0.5px)] sm:w-[calc(33.333%-0.667px)] lg:w-[calc(25%-0.75px)] bg-[#0A0A0A] p-6 text-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.fotoUrl}
                    alt={p.nombre}
                    className="w-32 h-32 object-cover mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                  <h3 className="text-white text-sm font-semibold">{p.nombre}</h3>
                  {p.cargo && <p className="text-[#9CA3AF] text-xs mt-1">{p.cargo}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
