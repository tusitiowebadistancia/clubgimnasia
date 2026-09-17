import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function BowlingCTA() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
  Organizá tu próxima salida de bowling
</h2>

          <p className="mb-8 text-zinc-400">
            Escribinos por WhatsApp y coordiná tu visita de forma rápida y simple.
          </p>

          <PrimaryButton
  href="https://wa.me/542262589377?text=Hola%2C%20quiero%20consultar%20por%20bowling%20en%20Bowling%20Club%20Gimnasia."
  target="_blank"
  rel="noreferrer"
>
  Consultar por WhatsApp
</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}