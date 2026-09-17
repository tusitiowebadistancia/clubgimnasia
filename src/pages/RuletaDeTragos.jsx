import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import { ruletaDeTragosOptions } from "../data/ruletaDeTragosData";

export default function RuletaDeTragos() {
  const [started, setStarted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const total = ruletaDeTragosOptions.length;
  const slice = 360 / total;

  const colors = useMemo(
    () => [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ],
    []
  );

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const selectedIndex = Math.floor(Math.random() * total);
    const extraTurns = 360 * 6;

    // centro exacto del segmento ganador
    const targetCenter = selectedIndex * slice + slice / 2;

    // como la flecha está arriba (0 grados visuales), la rueda debe compensar
    const finalRotation = rotation + extraTurns + (360 - targetCenter);

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(ruletaDeTragosOptions[selectedIndex]);
      setSpinning(false);
    }, 4200);
  };

  return (
    <MainLayout>
      <SEO
        title="Ruleta de Tragos | Bowling Club Gimnasia"
        description="Juego Ruleta de Tragos de Bowling Club Gimnasia."
        keywords="ruleta de tragos, juego para beber, bowling club gimnasia"
        url="https://bowlingclubgimnasia.com/juegos/ruleta-de-tragos"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-5xl">
          {!started ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                Juego 2
              </p>

              <h1 className="mb-6 text-4xl md:text-5xl">Ruleta de Tragos</h1>

              <p className="mb-8 text-lg text-zinc-300">
                Girá la ruleta y aceptá lo que toque. Gana quien más resista.
              </p>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="mb-4 text-2xl">Reglas</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>La ruleta está dividida en 8 opciones aleatorias.</li>
                  <li>Cada color tiene oculto una acción o cantidad de tragos.</li>
                  <li>El jugador debe cumplir lo que salga.</li>
                  <li>Gana quien más resista jugando.</li>
                </ul>
              </div>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h3 className="mb-4 text-xl">Opciones de la ruleta</h3>
                <ul className="space-y-2 text-zinc-300">
                  {ruletaDeTragosOptions.map((option) => (
                    <li key={option.id}>• {option.label}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setStarted(true)}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Jugar
                </button>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Volver a Juegos
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
                    Ruleta activa
                  </p>
                  <h2 className="text-3xl md:text-4xl">Girarla y aceptá el resultado</h2>
                </div>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Salir del juego
                </Link>
              </div>

              <div className="mb-10 flex flex-col items-center">
                {/* puntero */}
                <div className="relative z-10 mb-[-10px] h-0 w-0 border-l-[16px] border-r-[16px] border-t-[26px] border-l-transparent border-r-transparent border-t-white" />

                {/* ruleta */}
                <div className="relative flex h-[320px] w-[320px] items-center justify-center md:h-[420px] md:w-[420px]">
                  <div
                    className="relative h-full w-full rounded-full border-4 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning
                        ? "transform 4.2s cubic-bezier(0.15, 0.85, 0.15, 1)"
                        : "none",
                      background: `conic-gradient(
                        ${colors[0]} 0deg 45deg,
                        ${colors[1]} 45deg 90deg,
                        ${colors[2]} 90deg 135deg,
                        ${colors[3]} 135deg 180deg,
                        ${colors[4]} 180deg 225deg,
                        ${colors[5]} 225deg 270deg,
                        ${colors[6]} 270deg 315deg,
                        ${colors[7]} 315deg 360deg
                      )`,
                    }}
                  >
                    

                    <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 shadow-[0_0_20px_rgba(255,255,255,0.12)] md:h-16 md:w-16" />
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={spinWheel}
                  disabled={spinning}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {spinning ? "Girando..." : "Girar ruleta"}
                </button>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Volver a Juegos
                </Link>
              </div>

              {result && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-zinc-100">
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
                    Resultado
                  </p>
                  <h3 className="text-2xl md:text-3xl">{result.label}</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}