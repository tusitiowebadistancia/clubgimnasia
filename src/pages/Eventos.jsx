import MainLayout from "../components/layout/MainLayout";
import EventosHero from "../components/sections/eventos/EventosHero";
import EventosTypes from "../components/sections/eventos/EventosTypes";
import EventosIncludes from "../components/sections/eventos/EventosIncludes";
import EventosPlans from "../components/sections/eventos/EventosPlans";
import EventosGallery from "../components/sections/eventos/EventosGallery";
import EventosBenefits from "../components/sections/eventos/EventosBenefits";
import EventosFaq from "../components/sections/eventos/EventosFaq";
import EventosCTA from "../components/sections/eventos/EventosCTA";

export default function Eventos() {
  return (
    <MainLayout>
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