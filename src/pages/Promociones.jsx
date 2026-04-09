import MainLayout from "../components/layout/MainLayout";
import PromocionesHero from "../components/sections/promociones/PromocionesHero";
import PromosDelDia from "../components/sections/promociones/PromosDelDia";
import PromosSemanales from "../components/sections/promociones/PromosSemanales";
import PromosCombos from "../components/sections/promociones/PromosCombos";
import PromosGrupos from "../components/sections/promociones/PromosGrupos";
import PromosCondiciones from "../components/sections/promociones/PromosCondiciones";
import PromosCTA from "../components/sections/promociones/PromosCTA";

export default function Promociones() {
  return (
    <MainLayout>
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