import NotificationSettings from "../components/NotificationSettings";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

// Página inicial premium
import LayoutTop from "../pages/LayoutTop";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Páginas internas
import Predios from "../pages/Predios";
import PredioForm from "../pages/PredioForm";
import Documentos from "../pages/Documentos";
import DocumentoForm from "../pages/DocumentoForm";
import Pagamentos from "../pages/Pagamentos";
import PagamentoForm from "../pages/PagamentoForm";
import Reservas from "../pages/Reservas";
import ReservaForm from "../pages/ReservaForm";
import Fornecedores from "../pages/Fornecedores";
import FornecedorForm from "../pages/FornecedorForm";
import Incidentes from "../pages/Incidentes";
import IncidenteForm from "../pages/IncidenteForm";
import Limpezas from "../pages/Limpezas";
import LimpezaForm from "../pages/LimpezaForm";
import Reunioes from "../pages/Reunioes";
import ReuniaoForm from "../pages/ReuniaoForm";
import Tarefas from "../pages/Tarefas";
import TarefaForm from "../pages/TarefaForm";
import Veiculos from "../pages/Veiculos";
import VeiculoForm from "../pages/VeiculoForm";
import Utilizadores from "../pages/Utilizadores";
import UtilizadorForm from "../pages/UtilizadorForm";
import Notificacoes from "../pages/Notificacoes";
import Perfil from "../pages/Perfil";
import Login from "../pages/Login";
import Fracoes from "../pages/Fracoes";
import FractionForm from "../pages/FractionForm";
import FractionsList from "../pages/FractionsList";
import Condominos from "../pages/Condominos";
import CondominoForm from "../pages/CondominoForm";
import Contratos from "../pages/Contratos";
import ContratoForm from "../pages/ContratoForm";
import Obras from "../pages/Obras";
import ObraForm from "../pages/ObraForm";
import Seguros from "../pages/Seguros";
import SeguroForm from "../pages/SeguroForm";
import Inventario from "../pages/Inventario";
import InventarioForm from "../pages/InventarioForm";
import Avisos from "../pages/Avisos";
import AvisoForm from "../pages/AvisoForm";
import Animais from "../pages/Animais";
import AnimalForm from "../pages/AnimalForm";
import Chaves from "../pages/Chaves";
import ChaveForm from "../pages/ChaveForm";
import Exportacoes from "../pages/Exportacoes";
import ExportacaoForm from "../pages/ExportacaoForm";
import Mensagens from "../pages/Mensagens";
import MensagemForm from "../pages/MensagemForm";
import TenantsForm from "../pages/TenantsForm";
import OwnersForm from "../pages/OwnersForm";

export default function AppRouter() {
  return (
    <Routes>

        <Route path="/settings/notifications" element={<NotificationSettings />} />
  

      {/* Página inicial premium — FORA do AppLayout */}
      <Route path="/" element={<LayoutTop />} />

      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas internas COM layout */}
      <Route element={<AppLayout />}>

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Todas as outras páginas */}
        <Route path="/predios" element={<Predios />} />
        <Route path="/predios/novo" element={<PredioForm />} />
        <Route path="/predios/:id" element={<PredioForm />} />

        <Route path="/fracoes" element={<Fracoes />} />
        <Route path="/fractions" element={<FractionsList />} />
        <Route path="/fractions/new" element={<FractionForm />} />
        <Route path="/fractions/:id" element={<FractionForm />} />

        <Route path="/condominos" element={<Condominos />} />
        <Route path="/condominos/novo" element={<CondominoForm />} />
        <Route path="/condominos/:id" element={<CondominoForm />} />

        <Route path="/documentos" element={<Documentos />} />
        <Route path="/documentos/novo" element={<DocumentoForm />} />
        <Route path="/documentos/:id" element={<DocumentoForm />} />

        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/pagamentos/novo" element={<PagamentoForm />} />
        <Route path="/pagamentos/:id" element={<PagamentoForm />} />

        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/novo" element={<ReservaForm />} />
        <Route path="/reservas/:id" element={<ReservaForm />} />

        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/fornecedores/novo" element={<FornecedorForm />} />
        <Route path="/fornecedores/:id" element={<FornecedorForm />} />

        <Route path="/incidentes" element={<Incidentes />} />
        <Route path="/incidentes/novo" element={<IncidenteForm />} />
        <Route path="/incidentes/:id" element={<IncidenteForm />} />

        <Route path="/limpezas" element={<Limpezas />} />
        <Route path="/limpezas/novo" element={<LimpezaForm />} />
        <Route path="/limpezas/:id" element={<LimpezaForm />} />

        <Route path="/reunioes" element={<Reunioes />} />
        <Route path="/reunioes/novo" element={<ReuniaoForm />} />
        <Route path="/reunioes/:id" element={<ReuniaoForm />} />

        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/tarefas/novo" element={<TarefaForm />} />
        <Route path="/tarefas/:id" element={<TarefaForm />} />

        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/veiculos/novo" element={<VeiculoForm />} />
        <Route path="/veiculos/:id" element={<VeiculoForm />} />

        <Route path="/utilizadores" element={<Utilizadores />} />
        <Route path="/utilizadores/novo" element={<UtilizadorForm />} />
        <Route path="/utilizadores/:id" element={<UtilizadorForm />} />

        <Route path="/contratos" element={<Contratos />} />
        <Route path="/contratos/novo" element={<ContratoForm />} />
        <Route path="/contratos/:id" element={<ContratoForm />} />

        <Route path="/obras" element={<Obras />} />
        <Route path="/obras/novo" element={<ObraForm />} />
        <Route path="/obras/:id" element={<ObraForm />} />

        <Route path="/seguros" element={<Seguros />} />
        <Route path="/seguros/novo" element={<SeguroForm />} />
        <Route path="/seguros/:id" element={<SeguroForm />} />

        <Route path="/inventario" element={<Inventario />} />
        <Route path="/inventario/novo" element={<InventarioForm />} />
        <Route path="/inventario/:id" element={<InventarioForm />} />

        <Route path="/avisos" element={<Avisos />} />
        <Route path="/avisos/novo" element={<AvisoForm />} />
        <Route path="/avisos/:id" element={<AvisoForm />} />

        <Route path="/animais" element={<Animais />} />
        <Route path="/animais/novo" element={<AnimalForm />} />
        <Route path="/animais/:id" element={<AnimalForm />} />

        <Route path="/chaves" element={<Chaves />} />
        <Route path="/chaves/novo" element={<ChaveForm />} />
        <Route path="/chaves/:id" element={<ChaveForm />} />

        <Route path="/exportacoes" element={<Exportacoes />} />
        <Route path="/exportacoes/novo" element={<ExportacaoForm />} />
        <Route path="/exportacoes/:id" element={<ExportacaoForm />} />

        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/mensagens/novo" element={<MensagemForm />} />
        <Route path="/mensagens/:id" element={<MensagemForm />} />

        <Route path="/tenants/novo" element={<TenantsForm />} />
        <Route path="/owners/novo" element={<OwnersForm />} />

        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/perfil" element={<Perfil />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
