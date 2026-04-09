import Reveal from "../../common/Reveal";

const items = [
  "Una propuesta distinta dentro de un entorno recreativo",
  "Espacio pensado para compartir y divertirse",
  "Posibilidad de combinar distintas actividades del club",
  "Experiencia adaptable según el tipo de festejo o grupo",
];

export default function EventosIncludes() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">¿Qué incluye la experiencia?</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6 text-zinc-300">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}