import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import Promociones from "@/components/sections/Promociones";
import Nosotros from "@/components/sections/Nosotros";
import Galeria from "@/components/sections/Galeria";
import Dinamicas from "@/components/sections/Dinamicas";
import Comentarios from "@/components/sections/Comentarios";
import Contacto from "@/components/sections/Contacto";

export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <Promociones />
      <Nosotros />
      <Galeria />
      <Dinamicas />
      <Comentarios />
      <Contacto />
    </>
  );
}
