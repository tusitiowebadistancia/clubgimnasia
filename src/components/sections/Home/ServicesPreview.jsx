import Reveal from "../../common/Reveal";

export default function ServicesPreview() {
  return (
    <section className="bg-[#111] py-20 px-4">
      <div className="mx-auto max-w-7xl">

        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl text-center">
            Nuestros Servicios
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">

          <Reveal>
            <div className="rounded-2xl bg-zinc-900 p-6 text-center hover:scale-105 transition">
              <h3 className="mb-4 text-xl">Bowling</h3>
              <p className="text-zinc-400">
                Disfrutá de nuestras pistas con amigos o familia
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl bg-zinc-900 p-6 text-center hover:scale-105 transition">
              <h3 className="mb-4 text-xl">Pool</h3>
              <p className="text-zinc-400">
                Mesas profesionales y ambiente ideal
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl bg-zinc-900 p-6 text-center hover:scale-105 transition">
              <h3 className="mb-4 text-xl">Eventos</h3>
              <p className="text-zinc-400">
                Cumpleaños y celebraciones únicas
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}