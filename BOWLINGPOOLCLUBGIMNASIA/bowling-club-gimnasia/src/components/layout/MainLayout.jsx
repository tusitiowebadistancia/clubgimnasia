import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "../common/WhatsAppButton";
import Breadcrumbs from "../common/Breadcrumbs";
import InteractiveBackground from "../common/InteractiveBackground";

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <InteractiveBackground />

      <div className="relative z-10">
        <Header />

        <div className="h-[80px]" />

        <Breadcrumbs />

        {children}

        <WhatsAppButton />
        <Footer />
      </div>
    </div>
  );
}