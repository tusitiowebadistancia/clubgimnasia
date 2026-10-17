import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";
import BowlingCarousel3D from "../../common/BowlingCarousel3D";

const images = [
  "/images/carruselbow.jpeg",
  "/images/bow1.png",
  "/images/bow3.png",
  "/images/bow4.png",
  "/images/carruselbow4.jpeg",
  "/images/carruselbow7.jpg",
];

export default function BowlingGallery() {
  return (
    <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="Galería"
            title="Momentos con Ustedes"
            description="Disfrutando con la mejor compania."
            centered
          />
        </Reveal>

        <Reveal>
          <BowlingCarousel3D images={images} />
        </Reveal>
      </div>
    </section>
  );
}