import Reveal from "../../common/Reveal";

export default function EventosCTA() {
  return (
    <section className="bg-[#111] px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Consultá por tu próximo evento
          </h2>

          <p className="mb-8 text-zinc-400">
            Escribinos por WhatsApp y coordinemos una propuesta adaptada a lo que buscás.
          </p>

          <a
            href="https://wa.me/542262589377?text=Hola%20quiero%20consultar%20por%20eventos"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Cotizar por WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}