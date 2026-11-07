import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import NeonClubLogo from "../components/common/NeonClubLogo";
import Hero from "../components/sections/Home/Hero";

import ServicesPreview from "../components/sections/Home/ServicesPreview";
import ExperienceSection from "../components/sections/Home/ExperienceSection";
import FeaturedPromos from "../components/sections/Home/FeaturedPromos";
import HomePromotions from "../components/sections/Home/HomePromotions";
import InteractiveGallery from "../components/sections/Home/InteractiveGallery";
import WhyChooseUs from "../components/sections/Home/WhyChooseUs";
import Testimonials from "../components/sections/Home/Testimonials";
import ScrollPinTransition from "../components/common/ScrollPinTransition";
import CTASection from "../components/sections/Home/CTASection";
import MobileVideoBanner from "../components/sections/Home/MobileVideoBanner";
import CampaignVideoStrip from "../components/common/CampaignVideoStrip";
//import MobileScrollGallery from "../components/sections/Home/MobileScrollGallery";

export default function Home() {
  return (
    <MainLayout>
      <SEO
        title="Bowling Club Gimnasia | Bowling, Pool y Eventos en Necochea"
        description="Descubrí Bowling Club Gimnasia en Necochea. Bowling, pool, eventos, promociones y reservas por WhatsApp."
        keywords="bowling necochea, pool necochea, eventos necochea, bowling club gimnasia"
        url="https://bowlingclubgimnasia.com/"
      />

      <Hero />
      <MobileVideoBanner />
      <ServicesPreview />
       <CampaignVideoStrip placement="HOME_AFTER_SERVICES" />
       <ExperienceSection />
       <HomePromotions />
       <FeaturedPromos />
      <CampaignVideoStrip placement="HOME_AFTER_PROMOS" />
      <InteractiveGallery />
      <WhyChooseUs />
      <Testimonials />
      <ScrollPinTransition />
      <CTASection />
    </MainLayout>
  );
}
