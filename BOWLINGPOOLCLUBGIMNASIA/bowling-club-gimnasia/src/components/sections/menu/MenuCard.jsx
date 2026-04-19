export default function MenuCard({ sections = [] }) {
  if (!sections.length) {
    return (
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-400/20 bg-zinc-900/80 p-8 text-center text-white">
        No hay secciones cargadas en el menú.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-yellow-200/20 bg-[linear-gradient(180deg,rgba(20,20,20,0.92),rgba(8,8,8,0.94))] p-8 text-white shadow-[0_0_40px_rgba(255,200,80,0.06)] backdrop-blur-sm md:p-12">
      <div className="rounded-[1.5rem] border border-yellow-300/10 p-6 md:p-8">
        <div className="space-y-14">
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent" />
              </div>

              <div className="mb-8 text-center">
                <h2 className="text-2xl tracking-[0.18em] text-yellow-300 md:text-3xl">
                  {section.title}
                </h2>

                {section.subtitle && (
                  <p className="mt-2 text-sm italic tracking-[0.08em] text-yellow-200/80 md:text-base">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-5">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={`${item.name}-${itemIndex}`}
                    className="group flex items-end justify-between gap-4 border-b border-white/10 pb-3 transition"
                  >
                    <div className="flex min-w-0 flex-1 items-end gap-3">
                      <span className="shrink-0 text-base text-zinc-100 md:text-lg">
                        {item.name}
                      </span>

                      <div className="mb-[0.35rem] h-px flex-1 border-b border-dotted border-white/15 transition group-hover:border-yellow-300/30" />
                    </div>

                    <span className="whitespace-nowrap text-base font-semibold text-yellow-200 md:text-lg">
                      {item.price || ""}
                    </span>
                  </div>
                ))}
              </div>

              {sectionIndex !== sections.length - 1 && (
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}