import SectionTitle from "../../common/SectionTitle";
import GameCard from "./GameCard";

export default function JuegosCategory({ eyebrow, title, description, items }) {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <GameCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              url={item.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}