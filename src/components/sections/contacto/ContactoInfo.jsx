import Reveal from "../../common/Reveal";

const info = [
  {
    title: "Ubicación",
    text: "Necochea, Buenos Aires",
  },
  {
    title: "WhatsApp",
    text: "2262 58-9377",
  },
  {
    title: "Atención",
    text: "Consultas por reservas, eventos y promociones",
  },
];

export default function ContactoInfo() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Información del club</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {info.map((item) => (
            <Reveal key={item.title}>
              <div className="rounded-2xl bg-zinc-900 p-8">
                <h3 className="mb-4 text-2xl">{item.title}</h3>
                <p className="text-zinc-400">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}