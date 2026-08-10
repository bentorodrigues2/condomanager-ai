import { Routes, Route } from "react-router-dom";

import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";

import DashboardAdministrador from "./pages/administrador/DashboardAdministrador.jsx";
import DashboardCondomino from "./pages/condomino/DashboardCondomino.jsx";
import DashboardGestor from "./pages/gestor/DashboardGestor.jsx";
import DashboardTecnico from "./pages/tecnico/DashboardTecnico.jsx";
import DashboardLimpezas from "./pages/limpezas/DashboardLimpezas.jsx";
import DashboardContabilista from "./pages/contabilista/DashboardContabilista.jsx";
import DashboardAuditor from "./pages/auditor/DashboardAuditor.jsx";
import DashboardJuridico from "./pages/juridico/DashboardJuridico.jsx";

export default function AppRouter({ role }) {
  const routes = {
    administrador: <DashboardAdministrador />,
    "condómino": <DashboardCondomino />,
    gestor: <DashboardGestor />,
    técnico: <DashboardTecnico />,
    limpezas: <DashboardLimpezas />,
    contabilista: <DashboardContabilista />,
    auditor: <DashboardAuditor />,
    juridico: <DashboardJuridico />,
  };

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas (temporárias até integrar AI Studio) */}
      <Route path="/*" element={routes[role] ?? <div>Perfil desconhecido</div>} />
    </Routes>
  );
}
