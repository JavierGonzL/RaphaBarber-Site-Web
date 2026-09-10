import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-24 sm:py-32 min-h-[600px]">
      {/* Foto real de la barbería */}
      <Image
        src="/images/poste-barberia.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_36%]"
      />
      {/* Velo oscuro para que el texto se siga leyendo sobre la foto */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 hero-gradient-overlay" />

      {/* Línea decorativa */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#7C97B2] to-transparent opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Título principal */}
        <h1 className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rapha-wordmark.svg"
            alt="Rapha"
            className="h-[4.5rem] sm:h-32 lg:h-40 w-auto mx-auto mb-2"
          />
          <span className="block font-display text-7xl sm:text-9xl lg:text-[10rem] leading-none tracking-wider text-[#7C97B2]">
            BARBER
          </span>
        </h1>

        <p className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#7C97B2] tracking-widest mb-6">
          Un concepto diferente
        </p>

        <p className="text-[#9CA3AF] text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          El corte que los campeones eligen. Cada visita, una experiencia única
          que va más allá del sillón.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reservar"
            className="bg-[#2E3E4F] text-white font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#3E5570] transition-colors"
          >
            Reservar Cita
          </Link>
          <Link
            href="/#servicios"
            className="border border-[#7C97B2]/50 text-[#7C97B2] font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:border-[#7C97B2] hover:bg-[#2E3E4F]/10 transition-colors"
          >
            Ver Servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
