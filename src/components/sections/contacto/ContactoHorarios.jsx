import Reveal from "../../common/Reveal";

const horarios = [
  "Martes a Domingos: 19:30hs a 03:30hs",
];

export default function ContactoHorarios() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Horarios</h2>
        </Reveal>

        <div className="space-y-4">
          {horarios.map((horario) => (
            <Reveal key={horario}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {horario}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}