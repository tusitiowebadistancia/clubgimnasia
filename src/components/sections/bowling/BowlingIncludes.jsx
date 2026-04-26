import Reveal from "../../common/Reveal";

const items = [
  "Un espacio pensado para compartir una salida distinta con amigos, familia o esa persona con la que querés pasarla bien.",
  "Un ambiente cómodo, social y entretenido que invita a jugar, relajarte y quedarte más tiempo.",
  "La propuesta ideal para salidas espontáneas, festejos, reuniones y momentos que merecen algo más que un plan común.",
  "La posibilidad de combinar bowling con otras áreas del club para vivir una experiencia más completa en un solo lugar.",
];

export default function BowlingIncludes() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">
            Mucho más que una pista: una experiencia para disfrutar de verdad
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}