import Reveal from "../../common/Reveal";
import NeonClubLogo from "../../common/NeonClubLogo";
import PrimaryButton from "../../common/PrimaryButton";

import heroImg from "../../../assets/images/hero.jpg";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <Reveal className="relative z-10 px-4 text-center">
        <NeonClubLogo />

        <p className="mb-8 text-lg text-zinc-300 md:text-xl">
          
        </p>

        <PrimaryButton
          href="https://wa.me/542262589377?text=Hola%2C%20quiero%20reservar%20o%20consultar%20por%20Bowling%20Club%20Gimnasia."
          target="_blank"
          rel="noreferrer"
        >
          Reservar ahora
        </PrimaryButton>
      </Reveal>
    </section>
  );
}