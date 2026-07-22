#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar router + layout + navegação no frontend...\n");

// ------------------------------------------------------
// Criar pastas
// ------------------------------------------------------
const dirs = [
  "frontend/src/layout",
  "frontend/src/pages",
  "frontend/src/pages/roles"
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});

// ------------------------------------------------------
// Layout.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/layout/Layout.jsx",
  `
import LogoutButton from "../components/auth/LogoutButton";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "220px", background: "#eee", padding: "20px" }}>
        <h3>CondoManager AI</h3>

        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/admin">Admin</Link></li>
            <li><Link to="/gestor">Gestor</Link></li>
            <li><Link to="/owner">Owner</Link></li>
            <li><Link to="/viewer">Viewer</Link></li>
          </ul>
        </nav>

        <LogoutButton />
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}
`
);
console.log("📌 Layout.jsx criado.");

// ------------------------------------------------------
// Dashboard.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/pages/Dashboard.jsx",
  `
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao CondoManager AI.</p>
    </div>
  );
}
`
);
console.log("📌 Dashboard.jsx criado.");

// ------------------------------------------------------
// NoAccess.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/pages/NoAccess.jsx",
  `
export default function NoAccess() {
  return (
    <div>
      <h1>Acesso Negado</h1>
      <p>Não tens permissões para aceder a esta página.</p>
    </div>
  );
}
`
);
console.log("📌 NoAccess.jsx criado.");

// ------------------------------------------------------
// Páginas por role
// ------------------------------------------------------
const rolePages = {
  AdminPage: "admin",
  GestorPage: "gestor",
  OwnerPage: "owner",
  ViewerPage: "viewer",
};

Object.entries(rolePages).forEach(([component, role]) => {
  fs.writeFileSync(
    `frontend/src/pages/roles/${component}.jsx`,
    `
export default function ${component}() {
  return (
    <div>
      <h1>Área ${role.toUpperCase()}</h1>
      <p>Apenas utilizadores com role "${role}" podem ver esta página.</p>
    </div>
  );
}
`
  );
  console.log(`📌 ${component}.jsx criado.`);
});

// ------------------------------------------------------
// Atualizar router
// ------------------------------------------------------
const routerPath = "frontend/src/App.jsx";
let routerContent = `
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleGuard from "./guards/RoleGuard";

import Layout from "./layout/Layout";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import Dashboard from "./pages/Dashboard";
import NoAccess from "./pages/NoAccess";

import AdminPage from "./pages/roles/AdminPage";
import GestorPage from "./pages/roles/GestorPage";
import OwnerPage from "./pages/roles/OwnerPage";
import ViewerPage from "./pages/roles/ViewerPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard role="admin">
                  <Layout>
                    <AdminPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestor"
            element={
              <ProtectedRoute>
                <RoleGuard role="gestor">
                  <Layout>
                    <GestorPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                <RoleGuard role="owner">
                  <Layout>
                    <OwnerPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/viewer"
            element={
              <ProtectedRoute>
                <RoleGuard role="viewer">
                  <Layout>
                    <ViewerPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route path="/no-access" element={<NoAccess />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`;

fs.writeFileSync(routerPath, routerContent);
console.log("📌 Router atualizado em App.jsx.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
console.log("\n🎉 Router + Layout + Navegação criados com sucesso!");
console.log("➡️ Agora o CondoManager AI tem navegação real por roles.\n");
