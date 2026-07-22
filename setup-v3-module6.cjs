const fs = require("fs");
const path = require("path");

function createDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("Created:", dir);
    }
}

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const src = path.join(__dirname, "src");

// FORM COMPONENTS
const formDir = path.join(src, "ui", "form");
createDir(formDir);

// Generic Input
createFile(
    path.join(formDir, "Input.jsx"),
    `
export default function Input({ label, value, onChange }) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <label>{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                }}
            />
        </div>
    );
}
`
);

// Generic Button
createFile(
    path.join(formDir, "Button.jsx"),
    `
export default function Button({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px 15px",
                background: "#4a6cf7",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
            }}
        >
            {children}
        </button>
    );
}
`
);

// CRUD pages folder
const crudDir = path.join(src, "pages", "crud");
createDir(crudDir);

// ENTITIES
const entities = [
    "condominios",
    "fracoes",
    "condominos",
    "fornecedores",
    "pagamentos",
    "incidencias",
    "tarefas",
    "assembleias",
    "documentos"
];

// Generate CRUD pages
entities.forEach((entity) => {
    const pascal = entity.charAt(0).toUpperCase() + entity.slice(1);

    // CREATE PAGE
    createFile(
        path.join(crudDir, `Create${pascal}.jsx`),
        `
import { useState } from "react";
import Input from "../../ui/form/Input";
import Button from "../../ui/form/Button";
import { add_${entity} } from "../../services/${entity}";

export default function Create${pascal}() {
    const [form, setForm] = useState({});

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const save = async () => {
        await add_${entity}(form);
        alert("${pascal} criado com sucesso!");
    };

    return (
        <div>
            <h2>Criar ${pascal}</h2>

            {Object.keys(form).map((key) => (
                <Input
                    key={key}
                    label={key}
                    value={form[key]}
                    onChange={(v) => update(key, v)}
                />
            ))}

            <Button onClick={save}>Guardar</Button>
        </div>
    );
}
`
    );

    // EDIT PAGE
    createFile(
        path.join(crudDir, `Edit${pascal}.jsx`),
        `
import { useState, useEffect } from "react";
import Input from "../../ui/form/Input";
import Button from "../../ui/form/Button";
import { update_${entity}, get_${entity} } from "../../services/${entity}";
import { useParams } from "react-router-dom";

export default function Edit${pascal}() {
    const { id } = useParams();
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await get_${entity}();
            const item = data.find((i) => i.id === id);
            setForm(item);
        }
        load();
    }, [id]);

    if (!form) return <p>A carregar...</p>;

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const save = async () => {
        await update_${entity}(id, form);
        alert("${pascal} atualizado com sucesso!");
    };

    return (
        <div>
            <h2>Editar ${pascal}</h2>

            {Object.keys(form).map((key) => (
                <Input
                    key={key}
                    label={key}
                    value={form[key]}
                    onChange={(v) => update(key, v)}
                />
            ))}

            <Button onClick={save}>Guardar Alterações</Button>
        </div>
    );
}
`
    );
});

// ROUTER UPDATE
const routerPath = path.join(src, "router.jsx");
createFile(
    routerPath,
    `
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

                ${entities
                    .map(
                        (e) =>
                            `<Route path="/create/${e}" element={<CRUD.Create${e.charAt(0).toUpperCase() + e.slice(1)} />} />
                             <Route path="/edit/${e}/:id" element={<CRUD.Edit${e.charAt(0).toUpperCase() + e.slice(1)} />} />`
                    )
                    .join("\n")}
            </Routes>
        </BrowserRouter>
    );
}
`
);

console.log("MODULE 6 COMPLETED");
console.log("CRUD completo instalado e funcional.");
