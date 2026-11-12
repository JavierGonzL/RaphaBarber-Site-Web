import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — RaphaBarber",
  description: "Aviso de privacidad de Rapha Barber Studio sobre el tratamiento de datos personales.",
};

const h2 = "font-display text-2xl text-white tracking-wide mt-10 mb-3";
const p = "text-[#9CA3AF] leading-relaxed";
const li = "text-[#9CA3AF] leading-relaxed";

export default function AvisoPrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#000000] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-[#7C97B2] uppercase tracking-widest mb-3">Rapha Barber Studio</p>
        <h1 className="font-display text-5xl text-white tracking-wide mb-6">AVISO DE PRIVACIDAD</h1>
        <p className={p}>
          Última actualización: 9 de septiembre de 2026. Este aviso se emite de conformidad con la Ley Federal de
          Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
        </p>

        <h2 className={h2}>1. Responsable del tratamiento</h2>
        <p className={p}>
          Rapha Barber Studio, con domicilio en Pachuca, Hidalgo, México, es responsable del tratamiento de los datos
          personales que nos proporcionas a través de este sitio web.
        </p>

        <h2 className={h2}>2. Datos personales que recabamos</h2>
        <p className={p}>Al agendar una cita a través de nuestro sitio, recabamos directamente de ti:</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li className={li}>Nombre completo</li>
          <li className={li}>Número de teléfono / WhatsApp</li>
          <li className={li}>Notas adicionales sobre tu cita (opcional)</li>
        </ul>
        <p className={`${p} mt-3`}>
          Para cubrir el anticipo de tu cita, el pago se procesa directamente por Mercado Pago. Rapha Barber Studio{" "}
          <span className="text-white">no recaba ni almacena</span> los datos de tu tarjeta ni información
          financiera: esos datos son capturados e ingresados directamente en la plataforma de Mercado Pago, conforme
          a su propio aviso de privacidad.
        </p>

        <h2 className={h2}>3. Finalidades del tratamiento</h2>
        <p className={p}>Tus datos personales se utilizan para las siguientes finalidades necesarias:</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li className={li}>Gestionar, confirmar y recordarte tu cita</li>
          <li className={li}>Contactarte por WhatsApp o teléfono en caso de cambios en tu cita</li>
          <li className={li}>Vincular tu pago de anticipo con tu reserva</li>
        </ul>

        <h2 className={h2}>4. Transferencia de datos</h2>
        <p className={p}>
          No compartimos tus datos personales con terceros, salvo con los proveedores estrictamente necesarios para
          operar el servicio de agendado y cobro: Mercado Pago (procesamiento del anticipo) y Google Calendar
          (agendado interno de citas). Estos proveedores tratan tus datos conforme a sus propias políticas de
          privacidad.
        </p>

        <h2 className={h2}>5. Derechos ARCO</h2>
        <p className={p}>
          Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales, así como a Oponerte al tratamiento de
          los mismos (derechos ARCO). Para ejercerlos, contáctanos por WhatsApp al{" "}
          <a href="https://wa.me/5217711816821" className="text-[#7C97B2] hover:underline">
            +52 1 771 181 6821
          </a>{" "}
          indicando tu nombre y la solicitud correspondiente.
        </p>

        <h2 className={h2}>6. Cambios a este aviso</h2>
        <p className={p}>
          Este aviso de privacidad puede actualizarse para reflejar cambios en nuestras prácticas o en la legislación
          aplicable. Publicaremos cualquier cambio en esta misma página con su fecha de actualización.
        </p>
      </div>
    </main>
  );
}
