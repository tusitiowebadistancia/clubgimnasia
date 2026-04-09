import MainLayout from "../components/layout/MainLayout";
import PoolHero from "../components/sections/pool/PoolHero";
import PoolEnvironment from "../components/sections/pool/PoolEnvironment";
import PoolHowItWorks from "../components/sections/pool/PoolHowItWorks";
import PoolPromos from "../components/sections/pool/PoolPromos";
import PoolTournaments from "../components/sections/pool/PoolTournaments";
import PoolGallery from "../components/sections/pool/PoolGallery";
import PoolFaq from "../components/sections/pool/PoolFaq";
import PoolCTA from "../components/sections/pool/PoolCTA";

export default function Pool() {
  return (
    <MainLayout>
      <PoolHero />
      <PoolEnvironment />
      <PoolHowItWorks />
      <PoolPromos />
      <PoolTournaments />
      <PoolGallery />
      <PoolFaq />
      <PoolCTA />
    </MainLayout>
  );
}