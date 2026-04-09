import Reveal from "../../common/Reveal";
import heroImg from "../../../assets/images/hero.jpg";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <Reveal className="relative z-10 px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Bowling Club Gimnasia
        </h1>

        <p className="mb-8 text-lg text-zinc-300 md:text-xl">
          Viví la mejor experiencia en bowling y pool en Necochea
        </p>

        <a
          href="https://wa.me/542262589377?text=Hola%20quiero%20reservar"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
        >
          Reservar ahora
        </a>
      </Reveal>
    </section>
  );
}