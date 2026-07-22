const fs = require('fs');
const path = require('path');

// Helper to create folders
function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log("Created:", dirPath);
    }
}

// Helper to create files
function createFile(filePath, content = "") {
    fs.writeFileSync(filePath, content);
    console.log("Created:", filePath);
}

// Base src folder
const src = path.join(__dirname, "src");
createDir(src);

// AUTH FOLDER
const authDir = path.join(src, "auth");
createDir(authDir);

// AuthContext.jsx
createFile(path.join(authDir, "AuthContext.jsx"), `
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (role) => {
        setUser({ role });
        localStorage.setItem("role", role);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
`);

// ProtectedRoute.jsx
createFile(path.join(authDir, "ProtectedRoute.jsx"), `
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowed }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (!allowed.includes(user.role)) return <Navigate to="/area-pessoal" replace />;

    return children;
}
`);

// roles.js
createFile(path.join(authDir, "roles.js"), `
export const ROLES = {
    ADMIN: "admin",
    GESTOR: "gestor",
    CONDOMINO: "condomino",
    FORNECEDOR: "fornecedor",
    LIMPEZAS: "limpezas",
    AUDITOR: "auditor",
    CONTABILIDADE: "contabilidade"
};
`);

// API MOCK
const apiDir = path.join(src, "api");
createDir(apiDir);

createFile(path.join(apiDir, "auth.js"), `
export function fakeLogin(role) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ role }), 500);
    });
}
`);

// PAGES
const pagesDir = path.join(src, "pages");
createDir(pagesDir);

// Login.jsx
createFile(path.join(pagesDir, "Login.jsx"), `
import { useAuth } from "../auth/AuthContext";
import { fakeLogin } from "../api/auth";
import { ROLES } from "../auth/roles";

export default function Login() {
    const { login } = useAuth();

    const handleLogin = async (role) => {
        const res = await fakeLogin(role);
        login(res.role);
    };

    return (
        <div>
            <h1>Login</h1>
            {Object.values(ROLES).map((r) => (
                <button key={r} onClick={() => handleLogin(r)}>
                    Entrar como {r}
                </button>
            ))}
        </div>
    );
}
`);

// AreaPessoal.jsx
createFile(path.join(pagesDir, "AreaPessoal.jsx"), `
import { useAuth } from "../auth/AuthContext";

export default function AreaPessoal() {
    const { user } = useAuth();
    return <h1>Área Pessoal — Perfil: {user?.role}</h1>;
}
`);

// DASHBOARDS
const dashboardsDir = path.join(src, "dashboards");
createDir(dashboardsDir);

const dashboards = [
    "admin",
    "gestor",
    "condomino",
    "fornecedor",
    "limpezas",
    "auditor",
    "contabilidade"
];

dashboards.forEach((d) => {
    createFile(path.join(dashboardsDir, `${d}.jsx`), `
export default function ${d}Dashboard() {
    return <h1>Dashboard ${d}</h1>;
}
`);
});

// ROUTER
createFile(path.join(src, "router.jsx"), `
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AreaPessoal from "./pages/AreaPessoal";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ROLES } from "./auth/roles";

import AdminDashboard from "./dashboards/admin";
import GestorDashboard from "./dashboards/gestor";
import CondominoDashboard from "./dashboards/condomino";
import FornecedorDashboard from "./dashboards/fornecedor";
import LimpezasDashboard from "./dashboards/limpezas";
import AuditorDashboard from "./dashboards/auditor";
import ContabilidadeDashboard from "./dashboards/contabilidade";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/area-pessoal" element={<AreaPessoal />} />

                <Route path="/admin" element={
                    <ProtectedRoute allowed={[ROLES.ADMIN]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/gestor" element={
                    <ProtectedRoute allowed={[ROLES.ADMIN, ROLES.GESTOR]}>
                        <GestorDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/condomino" element={
                    <ProtectedRoute allowed={[ROLES.CONDOMINO]}>
                        <CondominoDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/fornecedor" element={
                    <ProtectedRoute allowed={[ROLES.FORNECEDOR]}>
                        <FornecedorDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/limpezas" element={
                    <ProtectedRoute allowed={[ROLES.LIMPEZAS]}>
                        <LimpezasDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/auditor" element={
                    <ProtectedRoute allowed={[ROLES.AUDITOR]}>
                        <AuditorDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/contabilidade" element={
                    <ProtectedRoute allowed={[ROLES.CONTABILIDADE]}>
                        <ContabilidadeDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
`);

// MODULES FUTUROS
const modulesDir = path.join(src, "modules");
createDir(modulesDir);

[
    "financeiro",
    "assembleias",
    "documentos",
    "tarefas",
    "incidencias",
    "limpezas",
    "fornecedores",
    "auditoria",
    "contabilidade"
].forEach((m) => createDir(path.join(modulesDir, m)));

console.log("PART 1 COMPLETA — agora corre setup-v3-part2.js");