import MainLayout from "../components/layout/MainLayout";
import PoolHero from "../components/sections/pool/PoolHero";
import PoolEnvironment from "../components/sections/pool/PoolEnvironment";
import PoolHowItWorks from "../components/sections/pool/PoolHowItWorks";
{/*import PoolPromos from "../components/sections/pool/PoolPromos";*/}
import PoolTournaments from "../components/sections/pool/PoolTournaments";
import PoolGallery from "../components/sections/pool/PoolGallery";
import PoolFaq from "../components/sections/pool/PoolFaq";
import PoolCTA from "../components/sections/pool/PoolCTA";
import SEO from "../components/common/SEO";

export default function Pool() {
  return (
    <MainLayout>
      <SEO
  title="Pool en Necochea | Bowling Club Gimnasia"
  description="Jugá pool en Necochea en un ambiente ideal. Salidas con amigos, promociones y reservas rápidas."
  keywords="pool en necochea, mesas de pool necochea, jugar pool necochea"
  url="https://bowlingclubgimnasia.com/pool-necochea"
/>
      <PoolHero />
      <PoolEnvironment />
      <PoolHowItWorks />
      {/*<PoolPromos />*/}
      <PoolTournaments />
      <PoolGallery />
      <PoolFaq />
      <PoolCTA />
    </MainLayout>
  );
}