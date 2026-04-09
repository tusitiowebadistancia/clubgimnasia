import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../common/WhatsAppButton";
import Breadcrumbs from "../common/Breadcrumbs";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      {/* Espacio por header fijo */}
      <div className="h-[80px]" />

      <Breadcrumbs />

      {children}

      <WhatsAppButton />
      <Footer />
    </div>
  );
}