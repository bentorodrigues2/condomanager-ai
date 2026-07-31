import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import AppLayout from "../layout/AppLayout";

/* ================================
   IMPORTS DE PÁGINAS PRINCIPAIS
   ================================ */
import { Dashboard } from "../pages/Dashboard";
import { Condominios } from "../pages/condominios/Condominios";
import { Financeiro } from "../pages/financeiro/Financeiro";
import { Manutencao } from "../pages/manutencao/Manutencao";
import { Unidades } from "../pages/unidades/Unidades";
import { Configuracoes } from "../pages/configuracoes/Configuracoes";

/* ================================
   IMPORTS DE AUTENTICAÇÃO
   ================================ */
import { Login } from "../pages/auth/Login";
import { Recover } from "../pages/auth/Recover";
import { Register } from "../pages/auth/Register";

/* ================================
   IMPORTS DE SUBPÁGINAS
   ================================ */

/* Condominios */
import { GestaoPredios } from "../pages/condominios/GestaoPredios";
import { GestaoRelatorios } from "../pages/condominios/GestaoRelatorios";
import { GestaoReservas } from "../pages/condominios/GestaoReservas";
import { MultiCondominio } from "../pages/condominios/MultiCondominio";
import { PortalOrcamentos } from "../pages/condominios/PortalOrcamentos";
import { GestaoDocumentos } from "../pages/condominios/GestaoDocumentos";
import { GestaoAssembleias } from "../pages/condominios/GestaoAssembleias";

/* Financeiro */
import { GestaoContas } from "../pages/financeiro/GestaoContas";
import { GestaoMovimentos } from "../pages/financeiro/GestaoMovimentos";
import { GestaoEmissao } from "../pages/financeiro/GestaoEmissao";
import { GestaoFundoReserva } from "../pages/financeiro/GestaoFundoReserva";

/* Manutenção */
import { GestaoManutencaoIntervencoes } from "../pages/manutencao/GestaoManutencaoIntervencoes";
import { GestaoVistoriasLimpezas } from "../pages/manutencao/GestaoVistoriasLimpezas";

/* Unidades */
import { GestaoFracoes } from "../pages/unidades/GestaoFracoes";

/* IA */
import { IAavancada } from "../pages/ia/IAavancada";

/* Layout / Simulador */
import { PWASimulator } from "../pages/layout/PWASimulator";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/recover" element={<Recover />} />

        {/* Rotas protegidas */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  {/* Principais */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/condominios" element={<Condominios />} />
                  <Route path="/financeiro" element={<Financeiro />} />
                  <Route path="/manutencao" element={<Manutencao />} />
                  <Route path="/unidades" element={<Unidades />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />

                  {/* Condominios */}
                  <Route path="/condominios/predios" element={<GestaoPredios />} />
                  <Route path="/condominios/relatorios" element={<GestaoRelatorios />} />
                  <Route path="/condominios/reservas" element={<GestaoReservas />} />
                  <Route path="/condominios/multi" element={<MultiCondominio />} />
                  <Route path="/condominios/orcamentos" element={<PortalOrcamentos />} />
                  <Route path="/condominios/documentos" element={<GestaoDocumentos />} />
                  <Route path="/condominios/assembleias" element={<GestaoAssembleias />} />

                  {/* Financeiro */}
                  <Route path="/financeiro/contas" element={<GestaoContas />} />
                  <Route path="/financeiro/movimentos" element={<GestaoMovimentos />} />
                  <Route path="/financeiro/emissao" element={<GestaoEmissao />} />
                  <Route path="/financeiro/fundo-reserva" element={<GestaoFundoReserva />} />

                  {/* Manutenção */}
                  <Route path="/manutencao/intervencoes" element={<GestaoManutencaoIntervencoes />} />
                  <Route path="/manutencao/vistorias" element={<GestaoVistoriasLimpezas />} />

                  {/* Unidades */}
                  <Route path="/unidades/fracoes" element={<GestaoFracoes />} />

                  {/* IA */}
                  <Route path="/ia/avancada" element={<IAavancada />} />

                  {/* Simulador */}
                  <Route path="/simulador" element={<PWASimulator />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
