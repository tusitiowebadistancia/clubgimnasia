import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Bowling from "../pages/Bowling";
import Pool from "../pages/Pool";
import Eventos from "../pages/Eventos";
import Promociones from "../pages/Promociones";
import Contacto from "../pages/contacto";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bowling-necochea" element={<Bowling />} />
      <Route path="/pool-necochea" element={<Pool />} />
      <Route path="/eventos-necochea" element={<Eventos />} />
      <Route path="/promociones" element={<Promociones />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}