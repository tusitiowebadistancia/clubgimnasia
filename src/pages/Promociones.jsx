import MainLayout from "../components/layout/MainLayout";
import PromocionesHero from "../components/sections/promociones/PromocionesHero";
import PromosDelDia from "../components/sections/promociones/PromosDelDia";
import PromosSemanales from "../components/sections/promociones/PromosSemanales";
import PromosCombos from "../components/sections/promociones/PromosCombos";
import PromosGrupos from "../components/sections/promociones/PromosGrupos";
import PromosCondiciones from "../components/sections/promociones/PromosCondiciones";
import PromosCTA from "../components/sections/promociones/PromosCTA";
import SEO from "../components/common/SEO";

export default function Promociones() {
  return (
    <MainLayout>
      <SEO
  title="Promociones Bowling y Pool en Necochea"
  description="Descubrí promociones y combos en Bowling Club Gimnasia. Opciones para grupos, salidas y eventos."
  keywords="promociones bowling necochea, ofertas pool necochea"
  url="https://bowlingclubgimnasia.com/promociones"
/>
      <PromocionesHero />
      <PromosDelDia />
      <PromosSemanales />
      <PromosCombos />
      <PromosGrupos />
      <PromosCondiciones />
      <PromosCTA />
    </MainLayout>
  );
}