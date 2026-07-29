
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./dashboards/admin";
import GestorDashboard from "./dashboards/gestor";
import CondominoDashboard from "./dashboards/condomino";
import FornecedorDashboard from "./dashboards/fornecedor";
import LimpezasDashboard from "./dashboards/limpezas";
import AuditorDashboard from "./dashboards/auditor";
import ContabilidadeDashboard from "./dashboards/contabilidade";

import ProtectedRoute from "./auth/ProtectedRoute";


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

                } />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
} />
                             } />
            </Routes>
        </BrowserRouter>
    );
}

