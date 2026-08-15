import type { FastifyInstance } from "fastify";
import { google } from "googleapis";
import { prisma } from "../lib/prisma.js";
import { encrypt, decrypt } from "../lib/crypto.js";
import { createOAuthClient, GOOGLE_SCOPES } from "../lib/googleAuth.js";

export async function googleIntegracionRoutes(app: FastifyInstance) {
  // Paso 1: el admin hace clic en "Conectar Google Calendar" desde el panel.
  // Llega aquí con su JWT como query param (no hay forma de mandar un header
  // en una navegación normal del navegador), lo validamos y lo reenviamos a
  // Google metido en `state` para recuperarlo en el callback.
  app.get<{ Querystring: { token?: string } }>("/auth/google", async (request, reply) => {
    const { token } = request.query;
    if (!token) {
      return reply.status(401).send({ error: "Falta el token de administrador." });
    }
    try {
      app.jwt.verify(token);
    } catch {
      return reply.status(401).send({ error: "Token de administrador inválido o expirado." });
    }

    const oauthClient = createOAuthClient();
    const url = oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_SCOPES,
      state: token,
    });

    return reply.redirect(url);
  });

  // Paso 2: Google redirige aquí con el código de autorización.
  app.get<{ Querystring: { code?: string; state?: string; error?: string } }>(
    "/auth/google/callback",
    async (request, reply) => {
      const { code, state, error } = request.query;

      if (error) {
        return reply.status(400).send({ error: `Google devolvió un error: ${error}` });
      }
      if (!code || !state) {
        return reply.status(400).send({ error: "Falta el código o el estado de la autorización." });
      }
      try {
        app.jwt.verify(state);
      } catch {
        return reply.status(401).send({ error: "Estado de autorización inválido o expirado." });
      }

      const oauthClient = createOAuthClient();
      const { tokens } = await oauthClient.getToken(code);

      if (!tokens.refresh_token) {
        return reply.status(400).send({
          error:
            "Google no devolvió un refresh token (pasa si ya autorizaste antes). Ve a https://myaccount.google.com/permissions, quita el acceso de esta app y vuelve a intentarlo.",
        });
      }

      oauthClient.setCredentials(tokens);
      const oauth2 = google.oauth2({ auth: oauthClient, version: "v2" });
      const { data: perfil } = await oauth2.userinfo.get();

      // Solo hay un dueño/calendario: si ya había una conexión, la reemplazamos.
      await prisma.integracionGoogle.deleteMany({});
      await prisma.integracionGoogle.create({
        data: {
          cuentaEmail: perfil.email ?? "desconocido",
          calendarId: "primary",
          refreshTokenCifrado: encrypt(tokens.refresh_token),
        },
      });

      return reply.type("text/html").send(`
        <html><body style="font-family: sans-serif; background:#0A0A0A; color:#F5F0E8; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
          <div style="text-align:center;">
            <h1 style="color:#C9A84C;">Google Calendar conectado</h1>
            <p>Cuenta: ${perfil.email}</p>
            <p>Ya puedes cerrar esta pestaña.</p>
          </div>
        </body></html>
      `);
    }
  );

  app.get("/admin/google/estado", { preHandler: app.requireAdmin }, async () => {
    const integracion = await prisma.integracionGoogle.findFirst();
    return { conectado: Boolean(integracion), cuentaEmail: integracion?.cuentaEmail ?? null };
  });

  app.delete("/admin/google", { preHandler: app.requireAdmin }, async (request, reply) => {
    const integracion = await prisma.integracionGoogle.findFirst();
    if (!integracion) {
      return reply.status(404).send({ error: "No hay ninguna cuenta conectada." });
    }

    try {
      const oauthClient = createOAuthClient();
      await oauthClient.revokeToken(decrypt(integracion.refreshTokenCifrado));
    } catch {
      // Si Google ya no reconoce el token, igual limpiamos nuestro registro.
    }

    await prisma.integracionGoogle.delete({ where: { id: integracion.id } });
    return reply.status(204).send();
  });
}
