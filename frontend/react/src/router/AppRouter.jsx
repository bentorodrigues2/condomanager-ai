
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardGestor from '../pages/gestor/Dashboard';
import DashboardPremium from '../pages/gestor/DashboardPremium';
import Intervencoes from '../pages/modulos/intervencoes';
import Obras from '../pages/modulos/obras';
import Limpezas from '../pages/modulos/limpezas';
import Financeiro from '../pages/modulos/financeiro';
import Documentos from '../pages/modulos/documentos';
import Chat from '../pages/modulos/chat';
import Relatorios from '../pages/modulos/relatorios';
import Perfil from '../pages/Perfil';
import AcessoNegado from '../pages/AcessoNegado';
import AssistenteIA from '../pages/AssistenteIA';

import ProtectedRoute from '../components/ProtectedRoute';
import { UserProvider } from '../context/UserContext';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>

          <Route path="/gestor/dashboard" element={<DashboardGestor />} />
          <Route path="/gestor/dashboard-premium" element={<DashboardPremium />} />

          <Route path="/modulos/intervencoes" element={<Intervencoes />} />
          <Route path="/modulos/obras" element={<Obras />} />
          <Route path="/modulos/limpezas" element={<Limpezas />} />
          <Route path="/modulos/financeiro" element={<Financeiro />} />
          <Route path="/modulos/documentos" element={<Documentos />} />
          <Route path="/modulos/chat" element={<Chat />} />
          <Route path="/modulos/relatorios" element={<Relatorios />} />

          <Route path="/assistente-ia" element={<AssistenteIA />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
