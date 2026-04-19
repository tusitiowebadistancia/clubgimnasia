import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import Reveal from "../components/common/Reveal";
import MenuTitleLogo from "../components/common/MenuTitleLogo";
import MenuCard from "../components/sections/menu/MenuCard";
import { menuSections } from "../data/menuData";

export default function Menu() {
  return (
    <MainLayout>
      <SEO
        title="Menú del club | Bowling Club Gimnasia"
        description="Consultá el menú de Bowling Club Gimnasia en Necochea. Bebidas, tragos y comida."
        keywords="menu club gimnasia, bowling menu, bebidas, tragos, comida, necochea"
        url="https://bowlingclubgimnasia.com/menu"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-8 scale-[0.78] md:scale-100">
              <MenuTitleLogo />
            </div>
          </Reveal>

          <Reveal>
            <p className="mx-auto mb-14 max-w-3xl text-center text-lg text-zinc-300 md:text-xl">
              Todo lo que necesitás para acompañar la experiencia: bebidas,
              tragos y comida pensados para que cada partida, cada charla y cada
              momento en el club se disfrute al máximo.
            </p>
          </Reveal>

          <div className="mt-8">
            <MenuCard sections={menuSections} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}