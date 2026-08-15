import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const servicios = [
  { categoria: "Cortes", nombre: "Corte Clásico", descripcion: "Tijera y máquina, estilo intemporal.", precio: 150, duracion: 30 },
  { categoria: "Cortes", nombre: "Corte Degradado", descripcion: "Fade limpio y preciso a tu medida.", precio: 180, duracion: 40 },
  { categoria: "Cortes", nombre: "Corte + Diseño", descripcion: "Tu personalidad en cada línea.", precio: 220, duracion: 50 },
  { categoria: "Barba", nombre: "Arreglo de Barba", descripcion: "Perfilado y definición con navaja.", precio: 100, duracion: 20 },
  { categoria: "Barba", nombre: "Barba Completa", descripcion: "Lavado, recorte y aceites hidratantes.", precio: 150, duracion: 35 },
  { categoria: "Combos", nombre: "Corte + Barba", descripcion: "La dupla favorita de los jugadores.", precio: 280, duracion: 60 },
  { categoria: "Combos", nombre: "Experiencia Total", descripcion: "Corte, barba, cejas y bebida de bienvenida.", precio: 350, duracion: 80 },
];

async function main() {
  await prisma.$transaction(
    servicios.map((s, index) =>
      prisma.servicio.upsert({
        where: { id: `seed-servicio-${index}` },
        update: { ...s, orden: index, activo: true },
        create: { id: `seed-servicio-${index}`, ...s, orden: index, activo: true },
      })
    )
  );
  console.log(`Seed listo: ${servicios.length} servicios.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
