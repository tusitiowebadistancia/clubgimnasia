import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";

const baseCards = [
  { id: 1, emoji: "🍺" },
  { id: 2, emoji: "🎳" },
  { id: 3, emoji: "🎱" },
  { id: 4, emoji: "🍕" },
  { id: 5, emoji: "🎮" },
  { id: 6, emoji: "🔥" },
  { id: 7, emoji: "🥤" },
  { id: 8, emoji: "🍔" },
  { id: 9, emoji: "🎉" },
  { id: 10, emoji: "🍹" },
  { id: 11, emoji: "🃏" },
  { id: 12, emoji: "🎵" },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function buildDeck(totalCards) {
  const pairsNeeded = totalCards / 2;
  const selected = shuffle(baseCards).slice(0, pairsNeeded);

  const duplicated = selected.flatMap((card, index) => [
    {
      uid: `${card.id}-a-${index}`,
      pairId: card.id,
      emoji: card.emoji,
      flipped: false,
      matched: false,
    },
    {
      uid: `${card.id}-b-${index}`,
      pairId: card.id,
      emoji: card.emoji,
      flipped: false,
      matched: false,
    },
  ]);

  return shuffle(duplicated);
}

export default function JuegoMemoria() {
  const [started, setStarted] = useState(false);
  const [selectedCount, setSelectedCount] = useState(12);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [moves, setMoves] = useState(0);

  const hasWon = useMemo(() => {
    return cards.length > 0 && cards.every((card) => card.matched);
  }, [cards]);

  const startGame = () => {
    setCards(buildDeck(selectedCount));
    setSelectedCards([]);
    setLockBoard(false);
    setShowPenalty(false);
    setMoves(0);
    setStarted(true);
  };

  const restartGame = () => {
    setCards(buildDeck(selectedCount));
    setSelectedCards([]);
    setLockBoard(false);
    setShowPenalty(false);
    setMoves(0);
  };

  const handleCardClick = (uid) => {
    if (lockBoard) return;

    const clickedCard = cards.find((card) => card.uid === uid);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;
    if (selectedCards.length === 2) return;

    const updatedCards = cards.map((card) =>
      card.uid === uid ? { ...card, flipped: true } : card
    );

    const newSelected = [...selectedCards, uid];

    setCards(updatedCards);
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setLockBoard(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newSelected;
      const first = updatedCards.find((card) => card.uid === firstId);
      const second = updatedCards.find((card) => card.uid === secondId);

      if (!first || !second) {
        setSelectedCards([]);
        setLockBoard(false);
        return;
      }

      const isMatch = first.pairId === second.pairId;

      if (isMatch) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.uid === firstId || card.uid === secondId
                ? { ...card, matched: true }
                : card
            )
          );
          setSelectedCards([]);
          setLockBoard(false);
        }, 700);
      } else {
        setShowPenalty(true);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.uid === firstId || card.uid === secondId
                ? { ...card, flipped: false }
                : card
            )
          );
          setSelectedCards([]);
          setLockBoard(false);
        }, 1100);

        setTimeout(() => {
          setShowPenalty(false);
        }, 1900);
      }
    }
  };

  const gridCols =
  selectedCount === 8
    ? "grid-cols-4"
    : selectedCount === 12
    ? "grid-cols-4 md:grid-cols-4 lg:grid-cols-6"
    : selectedCount === 16
    ? "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
    : "grid-cols-4 md:grid-cols-6 lg:grid-cols-10";

  return (
    <MainLayout>
      <SEO
        title="Juego de Memoria | Bowling Club Gimnasia"
        description="Juego de memoria de Bowling Club Gimnasia."
        keywords="juego de memoria, cartas, juego para beber, bowling club gimnasia"
        url="https://bowlingclubgimnasia.com/juegos/memoria"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-3xl">
          {!started ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                Juego 3
              </p>

              <h1 className="mb-6 text-4xl md:text-5xl">Juego de Memoria</h1>

              <p className="mb-8 text-lg text-zinc-300">
                Elegí la cantidad de cartas, descubrí las parejas correctas y
                tratá de no fallar. Cada error te castiga.
              </p>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="mb-4 text-2xl">Reglas</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>Elegís cuántas cartas querés usar.</li>
                  <li>Debés encontrar las parejas iguales.</li>
                  <li>Si te equivocás, aparece el cartel: “¡Bebé un trago!”.</li>
                  <li>Ganás cuando encontrás todas las parejas.</li>
                </ul>
              </div>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h3 className="mb-4 text-xl">Cantidad de cartas</h3>

                <div className="flex flex-wrap gap-3">
                  {[8, 12, 16, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedCount(count)}
                      className={`rounded-xl px-5 py-3 font-semibold transition ${
                        selectedCount === count
                          ? "bg-white text-black"
                          : "border border-white/15 text-white hover:bg-white/5"
                      }`}
                    >
                      {count} cartas
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={startGame}
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
                    Juego activo
                  </p>
                  <h2 className="text-3xl md:text-4xl">Encontrá las parejas</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={restartGame}
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Reiniciar
                  </button>

                  <Link
                    to="/juegos"
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Salir del juego
                  </Link>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <span className="text-zinc-300">Cantidad de cartas: {selectedCount}</span>
                <span className="text-zinc-300">Movimientos: {moves}</span>
              </div>

              {showPenalty && (
                <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
                  <p className="text-2xl font-bold text-white">¡Bebé un trago!</p>
                </div>
              )}

              {hasWon && (
                <div className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-center">
                  <p className="text-2xl font-bold text-white">
                    ¡Ganaste! Encontraste todas las parejas.
                  </p>
                </div>
              )}

              <div className={`grid ${gridCols} gap-4`}>
                {cards.map((card) => {
                  const isVisible = card.flipped || card.matched;

                  return (
                    <button
                      key={card.uid}
                      onClick={() => handleCardClick(card.uid)}
                      className={`aspect-[3/4] rounded-2xl border border-white/10 transition ${
                        isVisible
                          ? "bg-white text-black"
                          : "bg-black/40 text-transparent hover:bg-white/5"
                      } ${card.matched ? "ring-2 ring-green-400/50" : ""}`}
                    >
                      <div className="flex h-full items-center justify-center text-3xl md:text-4xl">
                        {isVisible ? card.emoji : "?"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}