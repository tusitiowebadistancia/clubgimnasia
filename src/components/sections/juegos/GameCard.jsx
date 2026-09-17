import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function GameCard({ title, description, image, url }) {
  return (
    <Reveal>
      <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-sm">
        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover"
        />

        <div className="p-6">
          <h3 className="mb-3 text-2xl text-white">{title}</h3>
          <p className="mb-6 text-zinc-400">{description}</p>

          <PrimaryButton href={url}>
            Jugar
          </PrimaryButton>
        </div>
      </article>
    </Reveal>
  );
}