import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";
import BowlingCarousel3D from "../../common/BowlingCarousel3D";

const images = [
  "/images/pool1.jpg",
  "/images/carruselpool.jpeg",
  "/images/carruselpool4.jpg",
  "/images/carruselpool5.jpg",
  "/images/carruselpool6.jpg",
  "/images/carruselpool7.jpg",
];

export default function PoolGallery() {
  return (
    <section className="bg-white/[0.03] px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="Galería"
            title="Diversion junto a ustedes"
            description="Los mejores momementos con la mejor compania."
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