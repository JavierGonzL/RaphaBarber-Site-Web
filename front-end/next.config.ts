import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Las imágenes subidas (promociones, personas reconocidas) viven en el
    // backend. Si el <img> del navegador apuntara directo a
    // NEXT_PUBLIC_API_URL (ej. http://localhost:4000), cualquiera que vea el
    // sitio desde otro dispositivo (port forwarding, red local, etc.)
    // intentaría buscar ese "localhost" en su propio dispositivo y fallaría.
    // Al servir /uploads/* bajo el mismo origen del sitio, el navegador
    // siempre pide la imagen al host que sí está viendo, y es Next quien
    // reenvía la petición al backend del lado del servidor.
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
