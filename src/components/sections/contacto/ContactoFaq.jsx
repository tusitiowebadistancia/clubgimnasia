import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Cómo hago una reserva?",
    a: "Podés comunicarte por WhatsApp o completar el formulario de contacto para enviar tu consulta de manera rápida y sencilla.",
  },
  {
    q: "¿Puedo consultar por cumpleaños o eventos?",
    a: "Sí, esta página también está pensada para recibir consultas sobre cumpleaños, reuniones y eventos especiales.",
  },
  {
  q: "¿Qué pasa después de enviar una consulta?",
  a: "Una vez enviada, te van a contactar por WhatsApp para continuar la coordinación y resolver cualquier duda.",
},
];

export default function ContactoFaq() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Preguntas rápidas</h2>
        </Reveal>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Reveal key={faq.q}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                <h3 className="mb-3 text-xl">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}