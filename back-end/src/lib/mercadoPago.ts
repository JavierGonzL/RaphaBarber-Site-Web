import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { createHmac } from "node:crypto";

export const DEPOSITO_MONTO = Number(process.env.MP_DEPOSITO_MONTO ?? 150);

function getClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Falta MP_ACCESS_TOKEN en las variables de entorno.");
  }
  return new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
}

export async function crearPreferenciaAnticipo(params: {
  citaId: string;
  servicioNombre: string;
  clienteNombre: string;
}): Promise<{ preferenceId: string; initPoint: string }> {
  const preference = new Preference(getClient());
  const frontendUrl = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

  const resultado = await preference.create({
    body: {
      items: [
        {
          id: params.citaId,
          title: `Anticipo — ${params.servicioNombre}`,
          description: `Anticipo para apartar cita de ${params.clienteNombre}`,
          quantity: 1,
          currency_id: "MXN",
          unit_price: DEPOSITO_MONTO,
        },
      ],
      external_reference: params.citaId,
      notification_url: process.env.MP_NOTIFICATION_URL,
      back_urls: {
        success: `${frontendUrl}/reservar/confirmacion?cita=${params.citaId}`,
        pending: `${frontendUrl}/reservar/confirmacion?cita=${params.citaId}`,
        failure: `${frontendUrl}/reservar/confirmacion?cita=${params.citaId}`,
      },
      auto_return: "approved",
    },
  });

  if (!resultado.id || !resultado.init_point) {
    throw new Error("Mercado Pago no devolvió una preferencia válida.");
  }

  return { preferenceId: resultado.id, initPoint: resultado.init_point };
}

export async function obtenerPago(paymentId: string) {
  const payment = new Payment(getClient());
  return payment.get({ id: paymentId });
}

/**
 * Verifica la firma `x-signature` de un webhook de Mercado Pago.
 * Algoritmo documentado por MP: HMAC-SHA256 de "id:{dataId};request-id:{xRequestId};ts:{ts};"
 * usando el secreto del webhook configurado en el panel de MP.
 */
export function verificarFirmaWebhook(params: {
  xSignature: string | undefined;
  xRequestId: string | undefined;
  dataId: string | undefined;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret || !params.xSignature || !params.xRequestId || !params.dataId) {
    return false;
  }

  const partes = Object.fromEntries(
    params.xSignature.split(",").map((parte) => {
      const [clave, valor] = parte.split("=");
      return [clave?.trim(), valor?.trim()];
    })
  );

  const ts = partes["ts"];
  const hashRecibido = partes["v1"];
  if (!ts || !hashRecibido) return false;

  const manifest = `id:${params.dataId.toLowerCase()};request-id:${params.xRequestId};ts:${ts};`;
  const hashCalculado = createHmac("sha256", secret).update(manifest).digest("hex");

  return hashCalculado === hashRecibido;
}
