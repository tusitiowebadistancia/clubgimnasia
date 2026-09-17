import MainLayout from "../components/layout/MainLayout";
import EventosHero from "../components/sections/eventos/EventosHero";
import EventosTypes from "../components/sections/eventos/EventosTypes";
import EventosIncludes from "../components/sections/eventos/EventosIncludes";
import EventosPlans from "../components/sections/eventos/EventosPlans";
import EventosGallery from "../components/sections/eventos/EventosGallery";
import EventosBenefits from "../components/sections/eventos/EventosBenefits";
import EventosFaq from "../components/sections/eventos/EventosFaq";
import EventosCTA from "../components/sections/eventos/EventosCTA";
import SEO from "../components/common/SEO";

export default function Eventos() {
  return (
    <MainLayout>
      <SEO
  title="Eventos y Cumpleaños en Necochea | Bowling Club Gimnasia"
  description="Organizá cumpleaños y eventos en Necochea con bowling y entretenimiento. Consultá por WhatsApp."
  keywords="cumpleaños necochea, eventos bowling necochea, festejos necochea"
  url="https://bowlingclubgimnasia.com/eventos-necochea"
/>
      <EventosHero />
      <EventosTypes />
      <EventosIncludes />
      <EventosPlans />
      <EventosGallery />
      <EventosBenefits />
      <EventosFaq />
      <EventosCTA />
    </MainLayout>
  );
}