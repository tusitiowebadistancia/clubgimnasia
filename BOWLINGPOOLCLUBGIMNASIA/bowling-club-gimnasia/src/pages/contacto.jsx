import MainLayout from "../components/layout/MainLayout";
import ContactoHero from "../components/sections/contacto/ContactoHero";
import ContactoInfo from "../components/sections/contacto/ContactoInfo";
import ContactoMap from "../components/sections/contacto/ContactoMap";
import ContactoHorarios from "../components/sections/contacto/ContactoHorarios";
import ContactoWhatsApp from "../components/sections/contacto/ContactoWhatsApp";
import ContactoForm from "../components/sections/contacto/ContactoForm";
import ContactoFaq from "../components/sections/contacto/ContactoFaq";
import SEO from "../components/common/SEO";

export default function Contacto() {
  return (
    <MainLayout>
      <SEO
  title="Contacto Bowling Club Gimnasia Necochea"
  description="Consultá por reservas, eventos o promociones en Bowling Club Gimnasia. Atención rápida por WhatsApp."
  keywords="contacto bowling necochea, reservas bowling necochea"
  url="https://bowlingclubgimnasia.com/contacto"
/>
      <ContactoHero />
      <ContactoInfo />
      <ContactoMap />
      <ContactoHorarios />
      <ContactoWhatsApp />
      <ContactoForm />
      <ContactoFaq />
    </MainLayout>
  );
}