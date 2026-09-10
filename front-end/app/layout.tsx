import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RaphaBarber — La barbería del Pachuca",
  description:
    "Barbería premium en México. El corte favorito de los futbolistas del Pachuca. Reserva tu cita y vive una experiencia única.",
  keywords: ["barbería", "Pachuca", "cortes de pelo", "barba", "México"],
  openGraph: {
    title: "RaphaBarber — La barbería del Pachuca",
    description: "El corte favorito de los futbolistas del Pachuca.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-[#000000] text-[#FFFFFF] font-sans antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
