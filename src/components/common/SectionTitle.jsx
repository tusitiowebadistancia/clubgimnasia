export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">{eyebrow}</p>}
      <h2 className="mb-4 text-3xl md:text-4xl">{title}</h2>
      {description && <p className="text-zinc-300">{description}</p>}
    </div>
  );
}