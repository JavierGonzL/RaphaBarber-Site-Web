import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — RaphaBarber",
  description: "Términos y condiciones de reserva, anticipo y cancelación de Rapha Barber Studio.",
};

const h2 = "font-display text-2xl text-white tracking-wide mt-10 mb-3";
const p = "text-[#9CA3AF] leading-relaxed";
const li = "text-[#9CA3AF] leading-relaxed";

export default function TerminosCondicionesPage() {
  return (
    <main className="min-h-screen bg-[#000000] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Rapha Barber Studio</p>
        <h1 className="font-display text-5xl text-white tracking-wide mb-6">TÉRMINOS Y CONDICIONES</h1>
        <p className={p}>
          Última actualización: 9 de septiembre de 2026. Al agendar una cita a través de este sitio, aceptas los
          siguientes términos y condiciones.
        </p>

        <h2 className={h2}>1. Proceso de reserva</h2>
        <p className={p}>
          Para apartar un horario, debes proporcionar tu nombre y teléfono, elegir servicio, fecha y hora
          disponibles, y cubrir el anticipo correspondiente. La cita queda confirmada únicamente cuando el pago del
          anticipo es aprobado.
        </p>

        <h2 className={h2}>2. Anticipo y medios de pago</h2>
        <p className={p}>
          El anticipo se procesa a través de Mercado Pago, con tarjeta de crédito/débito o pago en efectivo en OXXO.
          El monto del anticipo se descuenta del costo total del servicio, que se liquida en la barbería el día de tu
          cita.
        </p>

        <h2 className={h2}>3. Cancelaciones y reembolsos</h2>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li className={li}>
            Si cancelas o reagendas con al menos 24 horas de anticipación, tu anticipo se conserva como saldo a
            favor para una futura cita.
          </li>
          <li className={li}>
            Si el pago no llega a aprobarse (rechazado o cancelado en Mercado Pago), el horario se libera
            automáticamente y no se te realiza ningún cobro.
          </li>
          <li className={li}>
            Si no te presentas a tu cita sin avisar con anticipación, el anticipo no es reembolsable.
          </li>
        </ul>

        <h2 className={h2}>4. Modificación de citas</h2>
        <p className={p}>
          Para reagendar tu cita, contáctanos por WhatsApp con la mayor anticipación posible; sujeto a disponibilidad
          de horarios.
        </p>

        <h2 className={h2}>5. Responsabilidad</h2>
        <p className={p}>
          Rapha Barber Studio no es responsable por fallas ajenas a su control en el procesamiento del pago (por
          ejemplo, interrupciones del servicio de Mercado Pago). En estos casos, contáctanos para resolver tu
          reserva.
        </p>

        <h2 className={h2}>6. Modificaciones a estos términos</h2>
        <p className={p}>
          Podemos actualizar estos términos y condiciones en cualquier momento. Los cambios se publicarán en esta
          misma página con su fecha de actualización.
        </p>

        <h2 className={h2}>7. Contacto</h2>
        <p className={p}>
          Dudas sobre tu reserva o estos términos:{" "}
          <a href="https://wa.me/5217711816821" className="text-[#7C97B2] hover:underline">
            +52 1 771 181 6821
          </a>
        </p>
      </div>
    </main>
  );
}
