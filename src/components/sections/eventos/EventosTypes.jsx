import Reveal from "../../common/Reveal";

const types = [
  {
    title: "Cumpleaños",
    text: "La opción ideal para festejar de una manera más divertida, compartiendo juegos, ambiente y un momento que realmente se recuerde.",
  },
  {
    title: "Grupos",
    text: "Perfecto para reuniones de amigos, salidas compartidas o encuentros sociales donde lo importante sea pasarla bien y disfrutar juntos.",
  },
  {
    title: "Eventos especiales",
    text: "Una propuesta flexible para organizar celebraciones, planes distintos y ocasiones que merecen un espacio con energía, entretenimiento y buena onda.",
  },
];

export default function EventosTypes() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">
            Eventos pensados para convertir cualquier ocasión en un gran momento
          </h2>
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