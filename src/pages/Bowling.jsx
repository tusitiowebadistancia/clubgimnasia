import MainLayout from "../components/layout/MainLayout";
import BowlingHero from "../components/sections/bowling/BowlingHero";
import BowlingIncludes from "../components/sections/bowling/BowlingIncludes";
import BowlingHowItWorks from "../components/sections/bowling/BowlingHowItWorks";
import BowlingPromos from "../components/sections/bowling/BowlingPromos";
import BowlingGallery from "../components/sections/bowling/BowlingGallery";
import BowlingFaq from "../components/sections/bowling/BowlingFaq";
import BowlingCTA from "../components/sections/bowling/BowlingCTA";

export default function Bowling() {
  return (
    <MainLayout>
      <BowlingHero />
      <BowlingIncludes />
      <BowlingHowItWorks />
      <BowlingPromos />
      <BowlingGallery />
      <BowlingFaq />
      <BowlingCTA />
    </MainLayout>
  );
}