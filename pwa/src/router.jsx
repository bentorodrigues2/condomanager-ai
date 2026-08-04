
import { Routes, Route } from "react-router-dom";
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
      <Route path="/*" element={routes[role] ?? <div>Perfil desconhecido</div>} />
    </Routes>
  );
}
