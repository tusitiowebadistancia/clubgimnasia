import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import NeonClubLogo from "../components/common/NeonClubLogo";
import Hero from "../components/sections/Home/Hero";

import ServicesPreview from "../components/sections/home/ServicesPreview";
import ExperienceSection from "../components/sections/home/ExperienceSection";
import FeaturedPromos from "../components/sections/home/FeaturedPromos";
import InteractiveGallery from "../components/sections/home/InteractiveGallery";
import WhyChooseUs from "../components/sections/home/WhyChooseUs";
import Testimonials from "../components/sections/home/Testimonials";
import ScrollPinTransition from "../components/common/ScrollPinTransition";
import CTASection from "../components/sections/home/CTASection";

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
      
      <ServicesPreview />
      <ExperienceSection />
      <FeaturedPromos />
      <InteractiveGallery />
      <WhyChooseUs />
      <Testimonials />
      <ScrollPinTransition />
      <CTASection />
    </MainLayout>
  );
}