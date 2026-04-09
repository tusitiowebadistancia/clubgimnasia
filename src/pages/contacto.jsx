import MainLayout from "../components/layout/MainLayout";
import ContactoHero from "../components/sections/contacto/ContactoHero";
import ContactoInfo from "../components/sections/contacto/ContactoInfo";
import ContactoMap from "../components/sections/contacto/ContactoMap";
import ContactoHorarios from "../components/sections/contacto/ContactoHorarios";
import ContactoWhatsApp from "../components/sections/contacto/ContactoWhatsApp";
import ContactoForm from "../components/sections/contacto/ContactoForm";
import ContactoFaq from "../components/sections/contacto/ContactoFaq";

export default function Contacto() {
  return (
    <MainLayout>
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