import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function CTASection() {
  return (
    <section className="bg-black/35 py-20 text-center px-4 backdrop-blur-[2px]">
      <Reveal>
        <h2 className="mb-6 text-3xl md:text-4xl">
          ¿Listo para jugar?
        </h2>

        <p className="mb-8 text-zinc-400">
          Reservá ahora y viví la experiencia
        </p>

        <PrimaryButton
          href="https://wa.me/542262589377?text=Hola%2C%20quiero%20hacer%20una%20consulta%20general%20sobre%20Bowling%20Club%20Gimnasia."
          target="_blank"
          rel="noreferrer"
        >
          Reservar por WhatsApp
        </PrimaryButton>
      </Reveal>
    </section>
  );
}