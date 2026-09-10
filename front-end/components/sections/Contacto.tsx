export default function Contacto() {
  return (
    <section id="contacto" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-4">Encuéntranos</p>
          <h2 className="section-title font-display text-5xl sm:text-6xl text-white tracking-wide mb-10">
            VISÍTANOS<br />
            <span className="text-[#7C97B2]">HOY</span>
          </h2>

          <div className="space-y-8">
            <div>
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Dirección</p>
              <p className="text-[#9CA3AF]">
                {/* TODO: reemplazar con dirección real */}
                Calle Ejemplo 123, Col. Centro<br />
                Pachuca, Hidalgo, México
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">Horarios</p>
              <p className="text-[#9CA3AF]">
                Lunes – Viernes: 9:00 – 20:00<br />
                Sábado: 9:00 – 18:00<br />
                Domingo: 10:00 – 15:00
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-2">WhatsApp</p>
              <a
                href="https://wa.me/5217711816821"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C97B2] hover:underline"
              >
                +52 1 771 181 6821
              </a>
            </div>

            <div>
              <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Redes sociales</p>
              <div className="flex gap-4">
                {[
                  { label: "Instagram", href: "https://instagram.com/" },
                  { label: "TikTok", href: "https://tiktok.com/@" },
                  { label: "Facebook", href: "https://facebook.com/" },
                ].map((r) => (
                  <a
                    key={r.label}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#7C97B2]/40 text-[#7C97B2] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#2E3E4F]/10 transition-colors"
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-[#111] border border-[#2E3E4F]/20 rounded-2xl min-h-[400px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
          <iframe
            title="Ubicacion Rapha Barber Studio"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.663827822227!2d-98.78846130000001!3d20.0645189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1a1005bd240cb%3A0x83daa6873cf5c95e!2sRAPHA%20BARBER%20STUDIO!5e0!3m2!1ses-419!2smx!4v1786901582526!5m2!1ses-419!2smx"
            className="w-full h-full min-h-[400px]"
            style={{
              border: 0,
              filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/5217711816821"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#2E3E4F] text-white p-4 rounded-full shadow-lg hover:bg-[#3E5570] transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </section>
  );
}
