
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./dashboards/admin";
import GestorDashboard from "./dashboards/gestor";
import CondominoDashboard from "./dashboards/condomino";
import FornecedorDashboard from "./dashboards/fornecedor";
import LimpezasDashboard from "./dashboards/limpezas";
import AuditorDashboard from "./dashboards/auditor";
import ContabilidadeDashboard from "./dashboards/contabilidade";

import ProtectedRoute from "./auth/ProtectedRoute";

import * as CRUD from "./pages/crud";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/gestor" element={<ProtectedRoute><GestorDashboard /></ProtectedRoute>} />
                <Route path="/condomino" element={<ProtectedRoute><CondominoDashboard /></ProtectedRoute>} />
                <Route path="/fornecedor" element={<ProtectedRoute><FornecedorDashboard /></ProtectedRoute>} />
                <Route path="/limpezas" element={<ProtectedRoute><LimpezasDashboard /></ProtectedRoute>} />
                <Route path="/auditor" element={<ProtectedRoute><AuditorDashboard /></ProtectedRoute>} />
                <Route path="/contabilidade" element={<ProtectedRoute><ContabilidadeDashboard /></ProtectedRoute>} />

                <Route path="/create/condominios" element={<CRUD.CreateCondominios />} />
                             <Route path="/edit/condominios/:id" element={<CRUD.EditCondominios />} />
<Route path="/create/fracoes" element={<CRUD.CreateFracoes />} />
                             <Route path="/edit/fracoes/:id" element={<CRUD.EditFracoes />} />
<Route path="/create/condominos" element={<CRUD.CreateCondominos />} />
                             <Route path="/edit/condominos/:id" element={<CRUD.EditCondominos />} />
<Route path="/create/fornecedores" element={<CRUD.CreateFornecedores />} />
                             <Route path="/edit/fornecedores/:id" element={<CRUD.EditFornecedores />} />
<Route path="/create/pagamentos" element={<CRUD.CreatePagamentos />} />
                             <Route path="/edit/pagamentos/:id" element={<CRUD.EditPagamentos />} />
<Route path="/create/incidencias" element={<CRUD.CreateIncidencias />} />
                             <Route path="/edit/incidencias/:id" element={<CRUD.EditIncidencias />} />
<Route path="/create/tarefas" element={<CRUD.CreateTarefas />} />
                             <Route path="/edit/tarefas/:id" element={<CRUD.EditTarefas />} />
<Route path="/create/assembleias" element={<CRUD.CreateAssembleias />} />
                             <Route path="/edit/assembleias/:id" element={<CRUD.EditAssembleias />} />
<Route path="/create/documentos" element={<CRUD.CreateDocumentos />} />
                             <Route path="/edit/documentos/:id" element={<CRUD.EditDocumentos />} />
            </Routes>
        </BrowserRouter>
    );
}
