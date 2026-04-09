import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/sections/home/Hero";
import ServicesPreview from "../components/sections/home/ServicesPreview";
import InteractiveGallery from "../components/sections/home/InteractiveGallery";
import CTASection from "../components/sections/home/CTASection";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <ServicesPreview />
      <InteractiveGallery />
      <CTASection />
    </MainLayout>
  );
}