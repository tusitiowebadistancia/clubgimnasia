import Reveal from "../../common/Reveal";

const types = [
  {
    title: "Cumpleaños",
    text: "Una propuesta ideal para festejar con amigos, familia y una experiencia diferente.",
  },
  {
    title: "Grupos",
    text: "Encuentros, celebraciones o reuniones sociales con una dinámica más entretenida.",
  },
  {
    title: "Eventos especiales",
    text: "Una base flexible para proyectar festejos, salidas organizadas y momentos únicos.",
  },
];

export default function EventosTypes() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Tipos de eventos</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {types.map((type) => (
            <Reveal key={type.title}>
              <div className="rounded-2xl bg-zinc-900 p-8 transition hover:-translate-y-1 hover:bg-zinc-800">
                <h3 className="mb-4 text-2xl">{type.title}</h3>
                <p className="text-zinc-400">{type.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}