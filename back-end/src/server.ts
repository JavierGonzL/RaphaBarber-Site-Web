import "dotenv/config";
import path from "node:path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import requireAdminPlugin from "./plugins/requireAdmin.js";
import { healthRoutes } from "./routes/health.js";
import { serviciosRoutes } from "./routes/servicios.js";
import { testimoniosRoutes } from "./routes/testimonios.js";
import { citasRoutes } from "./routes/citas.js";
import { authRoutes } from "./routes/auth.js";
import { promocionesRoutes } from "./routes/promociones.js";
import { videosRoutes } from "./routes/videos.js";
import { personasRoutes } from "./routes/personas.js";
import { adminRoutes } from "./routes/admin.js";
import { googleIntegracionRoutes } from "./routes/googleIntegracion.js";
import { reservasRoutes } from "./routes/reservas.js";
import { webhooksRoutes } from "./routes/webhooks.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await app.register(multipart, {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

await app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

await app.register(requireAdminPlugin);

await app.register(healthRoutes);
await app.register(serviciosRoutes);
await app.register(testimoniosRoutes);
await app.register(citasRoutes);
await app.register(authRoutes);
await app.register(promocionesRoutes);
await app.register(videosRoutes);
await app.register(personasRoutes);
await app.register(adminRoutes);
await app.register(googleIntegracionRoutes);
await app.register(reservasRoutes);
await app.register(webhooksRoutes);

const port = Number(process.env.PORT ?? 4000);

app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
