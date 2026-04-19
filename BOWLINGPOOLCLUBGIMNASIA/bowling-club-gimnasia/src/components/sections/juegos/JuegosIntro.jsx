import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

export default function JuegosIntro() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="Organización"
            title="Contenido separado por categorías"
            description="La página está preparada para incorporar nuevos juegos y recursos de forma simple. Cada tarjeta puede dirigir a una experiencia externa según el tipo de contenido."
          />
        </Reveal>
      </div>
    </section>
  );
}