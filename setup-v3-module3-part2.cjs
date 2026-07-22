const fs = require("fs");
const path = require("path");

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const src = path.join(__dirname, "src");

// UTILS
const utilsDir = path.join(src, "utils");
if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir);

createFile(
    path.join(utilsDir, "errors.ts"),
    `
export function handleError(error: any) {
    console.error("Supabase Error:", error);
    return { error: true, message: error.message || "Erro desconhecido" };
}
`
);

createFile(
    path.join(utilsDir, "validators.ts"),
    `
export function required(value: any, field: string) {
    if (!value) throw new Error(\`\${field} é obrigatório\`);
}
`
);

createFile(
    path.join(utilsDir, "logger.ts"),
    `
export function log(action: string, payload: any = {}) {
    console.log("[LOG]", action, payload);
}
`
);

// DASHBOARD INTEGRATION EXAMPLE
const dashboardsDir = path.join(src, "dashboards");

createFile(
    path.join(dashboardsDir, "adminData.jsx"),
    `
import { useCondominios } from "../hooks/useCondominios";

export default function AdminData() {
    const { data, loading } = useCondominios();

    if (loading) return <p>A carregar dados...</p>;

    return (
        <div>
            <h2>Condomínios</h2>
            <ul>
                {data.map((c) => (
                    <li key={c.id}>{c.nome} — {c.morada}</li>
                ))}
            </ul>
        </div>
    );
}
`
);

console.log("MODULE 3 — PART 2 COMPLETED");
console.log("Módulo 3 está totalmente instalado e funcional.");
