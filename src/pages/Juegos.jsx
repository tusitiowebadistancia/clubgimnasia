import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import Reveal from "../components/common/Reveal";
import SectionTitle from "../components/common/SectionTitle";
import GameCard from "../components/sections/juegos/GameCard";

const games = [
  {
    id: 1,
    title: "Adivina la Carta",
    description:
      "Imitá lo que aparezca en la carta. Si no adivinás o no cumplís la consigna, te toca beber 1 trago. Ideal para reuniones y previas.",
    image: "/images/cartamagica.jpg",
    url: "/juegos/carta-magica",
  },


{
  id: 2,
  title: "Ruleta de Tragos",
  description:
    "Girás la ruleta y aceptás el resultado que te toque. Ideal para reuniones y previas donde gana quien más resiste.",
  image: "/images/ruleta.jpg",
  url: "/juegos/ruleta-de-tragos",
},

{
  id: 3,
  title: "Juego de Memoria",
  description:
    "Poné a prueba tu memoria encontrando las parejas correctas. Cada error suma tensión: si fallás, aparece el cartel de castigo y toca beber.",
  image: "/images/juegodememoria.jpg",
  url: "/juegos/memoria",
},

{
  id: 4,
  title: "Juego de Preguntas",
  description:
    "Poné a prueba tus conocimientos con preguntas rápidas. Si respondés mal, te toca beber. Ideal para jugar entre amigos y ver quién resiste más.",
  image: "/images/juegodepreguntas.jpg",
  url: "/juegos/preguntas",
},

{
  id: 5,
  title: "Anotador de Truco",
  description:
    "Llevá el tanteador de una partida de truco de forma visual, rápida y prolija. Sumá palitos, corregí jugadas y seguí el partido sin perder el ritmo.",
  image: "/images/anotadordetruco.jpg",
  url: "/juegos/anotador-truco",
},

];

export default function Juegos() {
  return (
    <MainLayout>
      <SEO
        title="Juegos | Bowling Club Gimnasia"
        description="Explorá los juegos recreativos de Bowling Club Gimnasia."
        keywords="juegos, carta magica, juegos para beber, bowling club gimnasia"
        url="https://bowlingclubgimnasia.com/juegos"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              eyebrow="Juegos"
              title="Elegí un juego y empezá a jugar"
              description="Una selección de juegos recreativos y sociales para disfrutar desde el club."
              centered
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                image={game.image}
                url={game.url}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}