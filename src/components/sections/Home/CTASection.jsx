import Reveal from "../../common/Reveal";

export default function CTASection() {
  return (
    <section className="bg-black py-20 text-center px-4">
      <Reveal>
        <h2 className="mb-6 text-3xl md:text-4xl">
          ¿Listo para jugar?
        </h2>

        <p className="mb-8 text-zinc-400">
          Reservá ahora y viví la experiencia
        </p>

        <a
  href="https://wa.me/542262589377?text=Hola%20quiero%20reservar"
  target="_blank"
  rel="noreferrer"
  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
>
  Reservar por WhatsApp
</a>
      </Reveal>
    </section>
  );
}