import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function EventosCTA() {
  return (
    <section className="bg-[#111] px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Consultá por tu próximo evento
          </h2>

          <p className="mb-8 text-zinc-400">
            Escribinos por WhatsApp y coordinemos una propuesta adaptada a lo que buscás.
          </p>

          <PrimaryButton
  href="https://wa.me/542262589377?text=Hola%2C%20quiero%20consultar%20por%20eventos%20o%20cumplea%C3%B1os%20en%20Bowling%20Club%20Gimnasia."
  target="_blank"
  rel="noreferrer"
>
  Cotizar por WhatsApp
</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}