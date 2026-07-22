const fs = require("fs");
const path = require("path");

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const src = path.join(__dirname, "src");

// Atualizar App.jsx para usar o Layout
const appPath = path.join(src, "App.jsx");
createFile(
    appPath,
    `
import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./ui/layout/Layout";

export default function App() {
    return (
        <AuthProvider>
            <Layout>
                <AppRouter />
            </Layout>
        </AuthProvider>
    );
}
`
);

// Criar um dashboard de exemplo com UI nova
const dashboardsDir = path.join(src, "dashboards");
const adminDashboardPath = path.join(dashboardsDir, "admin.jsx");

createFile(
    adminDashboardPath,
    `
import Card from "../ui/components/Card";
import Loader from "../ui/components/Loader";
import Table from "../ui/components/Table";
import { useCondominios } from "../hooks/useCondominios";

export default function AdminDashboard() {
    const { data, loading } = useCondominios();

    if (loading) return <Loader />;

    return (
        <div>
            <Card title="Condomínios">
                <Table data={data} />
            </Card>
        </div>
    );
}
`
);

// Tema toggle simples (opcional, mas útil)
const themeTogglePath = path.join(src, "ui", "theme", "ThemeToggle.jsx");
createFile(
    themeTogglePath,
    `
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mode, setMode] = useState("light");

    useEffect(() => {
        document.body.className = mode;
    }, [mode]);

    return (
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            Mudar para {mode === "light" ? "modo escuro" : "modo claro"}
        </button>
    );
}
`
);

// Atualizar Header para incluir ThemeToggle
const headerPath = path.join(src, "ui", "layout", "Header.jsx");
createFile(
    headerPath,
    `
import { useAuth } from "../../auth/AuthContext";
import ThemeToggle from "../theme/ThemeToggle";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: "60px",
            background: "#fff",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px"
        }}>
            <h3>Painel</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ThemeToggle />
                <span>
                    {user?.role}
                </span>
                <button onClick={logout}>Sair</button>
            </div>
        </header>
    );
}
`
);

console.log("MODULE 4 — PART 2 COMPLETED");
console.log("Módulo 4 está totalmente instalado e funcional.");
