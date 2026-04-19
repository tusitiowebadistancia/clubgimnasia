import MainLayout from "../components/layout/MainLayout";
import BowlingHero from "../components/sections/bowling/BowlingHero";
import BowlingIncludes from "../components/sections/bowling/BowlingIncludes";
import BowlingHowItWorks from "../components/sections/bowling/BowlingHowItWorks";
import BowlingPromos from "../components/sections/bowling/BowlingPromos";
import BowlingGallery from "../components/sections/bowling/BowlingGallery";
import BowlingFaq from "../components/sections/bowling/BowlingFaq";
import BowlingCTA from "../components/sections/bowling/BowlingCTA";
import SEO from "../components/common/SEO";

export default function Bowling() {
  return (
    <MainLayout>
      <SEO
    title="Bowling en Necochea | Bowling Club Gimnasia"
    description="Disfrutá bowling en Necochea con amigos, familia o eventos. Reservas rápidas por WhatsApp en Bowling Club Gimnasia."
    keywords="bowling en necochea, bowling club gimnasia, bowling cumpleaños necochea"
    url="https://tudominio.com/bowling-necochea"
  />
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

