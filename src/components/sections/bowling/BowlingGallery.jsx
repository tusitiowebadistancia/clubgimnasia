import Reveal from "../../common/Reveal";

const images = [
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=1200&auto=format&fit=crop",
];

export default function BowlingGallery() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Galería</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {images.map((image, index) => (
            <Reveal key={index}>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={image}
                  alt={`Galería de bowling ${index + 1}`}
                  className="h-[320px] w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}