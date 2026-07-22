import React from "react";
import { Routes, Route } from "react-router-dom";

/* PRINCIPAL */
import Dashboard from "../pages/Dashboard";

/* PRÉDIOS */
import Predios from "../pages/Predios";
import PredioForm from "../pages/PredioForm";

/* FRAÇÕES */
import Fracoes from "../pages/Fracoes";
import FractionsList from "../pages/FractionsList";
import FractionForm from "../pages/FractionForm";
import OwnersForm from "../pages/OwnersForm";
import TenantsForm from "../pages/TenantsForm";

/* CONDÓMINOS */
import Condominos from "../pages/Condominos";
import CondominoForm from "../pages/CondominoForm";

/* PAGAMENTOS */
import Pagamentos from "../pages/Pagamentos";
import PagamentoForm from "../pages/PagamentoForm";

/* OBRAS */
import Obras from "../pages/Obras";
import ObraForm from "../pages/ObraForm";

/* LIMPEZAS */
import Limpezas from "../pages/Limpezas";
import LimpezaForm from "../pages/LimpezaForm";

/* DOCUMENTOS */
import Documentos from "../pages/Documentos";
import DocumentoForm from "../pages/DocumentoForm";

/* EXPORTAÇÕES */
import Exportacoes from "../pages/Exportacoes";
import ExportacaoForm from "../pages/ExportacaoForm";

/* FORNECEDORES */
import Fornecedores from "../pages/Fornecedores";
import FornecedorForm from "../pages/FornecedorForm";

/* AVISOS */
import Avisos from "../pages/Avisos";
import AvisoForm from "../pages/AvisoForm";

/* REUNIÕES */
import Reunioes from "../pages/Reunioes";
import ReuniaoForm from "../pages/ReuniaoForm";

/* TAREFAS */
import Tarefas from "../pages/Tarefas";
import TarefaForm from "../pages/TarefaForm";

/* VEÍCULOS */
import Veiculos from "../pages/Veiculos";
import VeiculoForm from "../pages/VeiculoForm";

/* CHAVES */
import Chaves from "../pages/Chaves";
import ChaveForm from "../pages/ChaveForm";

/* ANIMAIS */
import Animais from "../pages/Animais";
import AnimalForm from "../pages/AnimalForm";

/* ARRECADACOES / GARAGENS */
import Arrecadacoes from "../pages/Arrecadacoes";
import ArrecadacaoForm from "../pages/ArrecadacaoForm";

/* INCIDENTES / OCORRÊNCIAS */
import Incidentes from "../pages/Incidentes";
import IncidenteForm from "../pages/IncidenteForm";

/* RESERVAS DE ESPAÇOS */
import Reservas from "../pages/Reservas";
import ReservaForm from "../pages/ReservaForm";

/* CONTRATOS */
import Contratos from "../pages/Contratos";
import ContratoForm from "../pages/ContratoForm";

/* SEGUROS / APÓLICES */
import Seguros from "../pages/Seguros";
import SeguroForm from "../pages/SeguroForm";

/* INVENTÁRIO / EQUIPAMENTOS */
import Inventario from "../pages/Inventario";
import InventarioForm from "../pages/InventarioForm";

/* MENSAGENS INTERNAS / CHAT */
import Mensagens from "../pages/Mensagens";
import MensagemForm from "../pages/MensagemForm";

/* UTILIZADORES / ADMINISTRAÇÃO */
import Utilizadores from "../pages/Utilizadores";
import UtilizadorForm from "../pages/UtilizadorForm";

export default function AppRouter() {
  return (
    <Routes>
      {/* PRINCIPAL */}
      <Route path="/" element={<Dashboard />} />

      {/* PRÉDIOS */}
      <Route path="/predios" element={<Predios />} />
      <Route path="/predios/novo" element={<PredioForm />} />
      <Route path="/predios/:id" element={<PredioForm />} />

      {/* FRAÇÕES */}
      <Route path="/fracoes" element={<Fracoes />} />
      <Route path="/buildings/:buildingId/fractions" element={<FractionsList />} />
      <Route path="/fractions/new" element={<FractionForm />} />
      <Route path="/fractions/:id" element={<FractionForm />} />
      <Route path="/fractions/:fractionId/owners" element={<OwnersForm />} />
      <Route path="/fractions/:fractionId/tenant" element={<TenantsForm />} />

      {/* CONDÓMINOS */}
      <Route path="/condominos" element={<Condominos />} />
      <Route path="/condominos/novo" element={<CondominoForm />} />
      <Route path="/condominos/:id" element={<CondominoForm />} />

      {/* PAGAMENTOS */}
      <Route path="/pagamentos" element={<Pagamentos />} />
      <Route path="/pagamentos/novo" element={<PagamentoForm />} />
      <Route path="/pagamentos/:id" element={<PagamentoForm />} />

      {/* OBRAS */}
      <Route path="/obras" element={<Obras />} />
      <Route path="/obras/novo" element={<ObraForm />} />
      <Route path="/obras/:id" element={<ObraForm />} />

      {/* LIMPEZAS */}
      <Route path="/limpezas" element={<Limpezas />} />
      <Route path="/limpezas/novo" element={<LimpezaForm />} />
      <Route path="/limpezas/:id" element={<LimpezaForm />} />

      {/* DOCUMENTOS */}
      <Route path="/documentos" element={<Documentos />} />
      <Route path="/documentos/novo" element={<DocumentoForm />} />
      <Route path="/documentos/:id" element={<DocumentoForm />} />

      {/* EXPORTAÇÕES */}
      <Route path="/exportacoes" element={<Exportacoes />} />
      <Route path="/exportacoes/novo" element={<ExportacaoForm />} />
      <Route path="/exportacoes/:id" element={<ExportacaoForm />} />

      {/* FORNECEDORES */}
      <Route path="/fornecedores" element={<Fornecedores />} />
      <Route path="/fornecedores/novo" element={<FornecedorForm />} />
      <Route path="/fornecedores/:id" element={<FornecedorForm />} />

      {/* AVISOS */}
      <Route path="/avisos" element={<Avisos />} />
      <Route path="/avisos/novo" element={<AvisoForm />} />
      <Route path="/avisos/:id" element={<AvisoForm />} />

      {/* REUNIÕES */}
      <Route path="/reunioes" element={<Reunioes />} />
      <Route path="/reunioes/novo" element={<ReuniaoForm />} />
      <Route path="/reunioes/:id" element={<ReuniaoForm />} />

      {/* TAREFAS */}
      <Route path="/tarefas" element={<Tarefas />} />
      <Route path="/tarefas/novo" element={<TarefaForm />} />
      <Route path="/tarefas/:id" element={<TarefaForm />} />

      {/* VEÍCULOS */}
      <Route path="/veiculos" element={<Veiculos />} />
      <Route path="/veiculos/novo" element={<VeiculoForm />} />
      <Route path="/veiculos/:id" element={<VeiculoForm />} />

      {/* CHAVES */}
      <Route path="/chaves" element={<Chaves />} />
      <Route path="/chaves/novo" element={<ChaveForm />} />
      <Route path="/chaves/:id" element={<ChaveForm />} />

      {/* ANIMAIS */}
      <Route path="/animais" element={<Animais />} />
      <Route path="/animais/novo" element={<AnimalForm />} />
      <Route path="/animais/:id" element={<AnimalForm />} />

      {/* ARRECADACOES */}
      <Route path="/arrecadacoes" element={<Arrecadacoes />} />
      <Route path="/arrecadacoes/novo" element={<ArrecadacaoForm />} />
      <Route path="/arrecadacoes/:id" element={<ArrecadacaoForm />} />

      {/* INCIDENTES */}
      <Route path="/incidentes" element={<Incidentes />} />
      <Route path="/incidentes/novo" element={<IncidenteForm />} />
      <Route path="/incidentes/:id" element={<IncidenteForm />} />

      {/* RESERVAS */}
      <Route path="/reservas" element={<Reservas />} />
      <Route path="/reservas/novo" element={<ReservaForm />} />
      <Route path="/reservas/:id" element={<ReservaForm />} />

      {/* CONTRATOS */}
      <Route path="/contratos" element={<Contratos />} />
      <Route path="/contratos/novo" element={<ContratoForm />} />
      <Route path="/contratos/:id" element={<ContratoForm />} />

      {/* SEGUROS */}
      <Route path="/seguros" element={<Seguros />} />
      <Route path="/seguros/novo" element={<SeguroForm />} />
      <Route path="/seguros/:id" element={<SeguroForm />} />

      {/* INVENTÁRIO */}
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/inventario/novo" element={<InventarioForm />} />
      <Route path="/inventario/:id" element={<InventarioForm />} />

      {/* MENSAGENS INTERNAS */}
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="/mensagens/novo" element={<MensagemForm />} />
      <Route path="/mensagens/:id" element={<MensagemForm />} />

      {/* UTILIZADORES */}
      <Route path="/utilizadores" element={<Utilizadores />} />
      <Route path="/utilizadores/novo" element={<UtilizadorForm />} />
      <Route path="/utilizadores/:id" element={<UtilizadorForm />} />
    </Routes>
  );
}