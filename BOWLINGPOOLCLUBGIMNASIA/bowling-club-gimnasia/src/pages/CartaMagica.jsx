import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import { cartaMagicaCards } from "../data/cartaMagicaData";

function getRandomCard(cards, currentId = null) {
  const filtered = cards.filter((card) => card.id !== currentId);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function CartaMagica() {
  const initialCard = useMemo(() => getRandomCard(cartaMagicaCards), []);
  const [started, setStarted] = useState(false);
  const [currentCard, setCurrentCard] = useState(initialCard);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timeUp, setTimeUp] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const nextCard = () => {
    setCurrentCard((prev) => getRandomCard(cartaMagicaCards, prev?.id));
    setTimeLeft(20);
    setTimeUp(false);
    setIsHidden(false);
  };

  useEffect(() => {
    if (!started || timeUp) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, currentCard, timeUp]);

  return (
    <MainLayout>
      <SEO
        title="Carta Mágica | Bowling Club Gimnasia"
        description="Juego Carta Mágica de Bowling Club Gimnasia."
        keywords="carta magica, juego para beber, bowling club gimnasia"
        url="https://tudominio.com/juegos/carta-magica"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-5xl">
          {!started ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                Juego 1
              </p>

              <h1 className="mb-6 text-4xl md:text-5xl">Adivina la carta</h1>

              <p className="mb-8 text-lg text-zinc-300">
                Un juego social para reuniones donde cada carta pone a prueba tu
                capacidad de imitar, actuar o reaccionar rápido.
              </p>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="mb-4 text-2xl">Reglas</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>Debés imitar lo que aparezca en la carta.</li>
                  <li>La imagen aparece junto al nombre de lo que es.</li>
                  <li>Tenés 20 segundos para reaccionar.</li>
                  <li>Podés ocultar la carta para que el rival no la vea.</li>
                  <li>Si no adivinás o no cumplís, debés beber 1 trago.</li>
                  <li>Después hacé clic en “Siguiente imagen”.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setStarted(true);
                    setTimeLeft(20);
                    setTimeUp(false);
                    setIsHidden(false);
                  }}
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
                    Carta activa
                  </p>
                  <h2 className="text-3xl md:text-4xl">
                    {isHidden ? "Carta oculta" : currentCard.name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      Tiempo
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        timeLeft <= 5
                          ? "text-red-400"
                          : timeLeft <= 10
                          ? "text-yellow-300"
                          : "text-white"
                      }`}
                    >
                      {timeLeft}s
                    </p>
                  </div>

                  <button
                    onClick={() => setIsHidden((prev) => !prev)}
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    {isHidden ? "Mostrar carta" : "Ocultar carta"}
                  </button>

                  <Link
                    to="/juegos"
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Salir del juego
                  </Link>
                </div>
              </div>

              <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                {isHidden ? (
                  <div className="flex h-[420px] w-full items-center justify-center bg-zinc-950 text-center">
                    <div className="px-6">
                      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Modo oculto
                      </p>
                      <h3 className="text-3xl font-bold text-white md:text-4xl">
                        La carta está oculta
                      </h3>
                      <p className="mt-4 text-zinc-400">
                        El tiempo sigue corriendo. Mostrala cuando quieras volver
                        a verla.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[420px] w-full items-center justify-center bg-black p-4">
                    <img
                      src={currentCard.image}
                      alt={currentCard.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-zinc-100">
                {timeUp ? (
                  <strong>¡Se terminó el tiempo! Bebé 1 trago.</strong>
                ) : (
                  <>
                    Si no adivinaste o no cumpliste la consigna:{" "}
                    <strong>bebé 1 trago</strong>.
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={nextCard}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Siguiente imagen
                </button>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Volver a Juegos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}