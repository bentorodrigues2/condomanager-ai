// src/router/AppRouter.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import LayoutTop from "../components/LayoutTop";
import Dashboard from "../modules/dashboard/Dashboard";
// importa aqui outros módulos/rotas que já tenhas

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Rota inicial a usar LayoutTop */}
          <Route path="/" element={<LayoutTop />} />

          {/* Exemplo: rota dashboard (mantém se já existir) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Wildcard: qualquer rota desconhecida volta à / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
