import Reveal from "../../common/Reveal";

const benefits = [
  "Una experiencia diferente a un festejo tradicional",
  "Más entretenimiento y participación para los invitados",
  "Un entorno recreativo que genera recuerdo y valor",
  "Ideal para quienes quieren celebrar de una forma distinta",
];

export default function EventosBenefits() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">¿Por qué elegirnos?</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Reveal key={benefit}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {benefit}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}