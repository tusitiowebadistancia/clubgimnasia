import Reveal from "../../common/Reveal";

const items = [
  "Promociones pensadas para grupos de amigos",
  "Opciones ideales para cumpleaños y reuniones",
  "Beneficios para salidas compartidas y planes sociales",
  "Mayor atractivo para eventos y encuentros organizados",
];

export default function PromosGrupos() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Promociones para grupos</h2>
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