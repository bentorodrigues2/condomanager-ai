import React, { useEffect, useState } from "react";
import DashboardAdministrador from "./pages/administrador/DashboardAdministrador.jsx";
import DashboardCondomino from "./pages/condomino/DashboardCondomino.jsx";
import DashboardGestor from "./pages/gestor/DashboardGestor.jsx";
import DashboardTecnico from "./pages/tecnico/DashboardTecnico.jsx";
import DashboardLimpezas from "./pages/limpezas/DashboardLimpezas.jsx";
import DashboardContabilista from "./pages/contabilista/DashboardContabilista.jsx";
import DashboardAuditor from "./pages/auditor/DashboardAuditor.jsx";
import DashboardJuridico from "./pages/juridico/DashboardJuridico.jsx";

import BottomBar from "./BottomBar.jsx";
import { supabase } from "./supabaseClient";

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const r = data?.user?.user_metadata?.role;
      setRole(r);
    });
  }, []);

  if (!role) return <div>Carregando...</div>;

  const dashboards = {
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
    <>
      {dashboards[role] ?? <div>Perfil desconhecido</div>}
      <BottomBar role={role} />
    </>
  );
}
