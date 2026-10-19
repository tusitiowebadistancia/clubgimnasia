import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Bowling from "../pages/Bowling";
import Pool from "../pages/Pool";
import Eventos from "../pages/Eventos";
// import Promociones from "../pages/Promociones";
import Contacto from "../pages/contacto";
import NotFound from "../pages/NotFound";
// import Juegos from "../pages/Juegos";
import Menu from "../pages/Menu";
// import CartaMagica from "../pages/CartaMagica";
// import RuletaDeTragos from "../pages/RuletaDeTragos";
// import JuegoMemoria from "../pages/JuegoMemoria";
// import JuegoPreguntas from "../pages/JuegoPreguntas";
import ScrollToTop from "../components/common/ScrollToTop";
// import AnotadorTruco from "../pages/AnotadorTruco";
import MenuQR from "../pages/MenuQR";
import ReglasBowling from "../pages/ReglasBowling";
import AdminLogin from "../admin/AdminLogin";
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AdminProducts from "../admin/AdminProducts";

import MainLayout from "../components/layout/MainLayout";

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bowling-necochea" element={<Bowling />} />
        <Route path="/pool-necochea" element={<Pool />} />
        <Route path="/eventos-necochea" element={<Eventos />} />
        {/* <Route path="/promociones" element={<Promociones />} /> */}
        <Route path="/contacto" element={<Contacto />} />
        {/* <Route path="/juegos" element={<Juegos />} /> */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu-qr" element={<MenuQR />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
        </Route>

        <Route
          path="/reglas-del-bowling"
          element={
            <MainLayout>
              <ReglasBowling />
            </MainLayout>
          }
        />

        {/* 
        <Route path="/juegos/carta-magica" element={<CartaMagica />} />
        <Route path="/juegos/ruleta-de-tragos" element={<RuletaDeTragos />} />
        <Route path="/juegos/memoria" element={<JuegoMemoria />} />
        <Route path="/juegos/preguntas" element={<JuegoPreguntas />} />
        <Route path="/juegos/anotador-truco" element={<AnotadorTruco />} />
        */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
