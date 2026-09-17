import Reveal from "../../common/Reveal";

const items = [
  "Un ambiente cómodo y relajado para disfrutar el juego sin apuro, compartir charlas y pasarla bien con amigos.",
  "El espacio ideal para una salida informal, una previa distinta o una noche donde el pool sea la excusa para quedarse más tiempo.",
  "Una experiencia pensada para combinar entretenimiento, buena compañía y ese clima que hace que la salida se sienta completa.",
  "Una propuesta diferente dentro de Bowling Club Gimnasia para quienes buscan algo más que una mesa: buscan pasar un gran momento.",
];

export default function PoolEnvironment() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">
            Un espacio pensado para jugar, relajarte y quedarte un rato más
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