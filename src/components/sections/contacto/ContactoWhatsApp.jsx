import Reveal from "../../common/Reveal";

export default function ContactoWhatsApp() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Escribinos directo por WhatsApp
          </h2>

          <p className="mb-8 text-zinc-400">
            Si querés una respuesta rápida, este es el camino más directo.
          </p>

          <a
            href="https://wa.me/542262589377?text=Hola%20quiero%20hacer%20una%20consulta"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Hablar por WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}