import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function write(file, content) {
  const full = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("✔ Criado:", file);
}

// ============================================================
// 1. Criar estrutura base da PWA
// ============================================================

write("pwa/index.html", `
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <title>CondoManager AI - PWA</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

write("pwa/src/main.jsx", `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
`);
// ============================================================
// 2. Barra inferior por perfil (Opção C)
// ============================================================

write("pwa/src/BottomBar.jsx", `
import { NavLink } from "react-router-dom";
import "./BottomBar.css";

const itemsByRole = {
  "condómino": [
    { to: "/inicio", label: "Início" },
    { to: "/financas", label: "Finanças" },
    { to: "/avarias", label: "Avarias" },
    { to: "/modulos", label: "Módulos" },
    { to: "/perfil", label: "Perfil" },
  ],
  "gestor": [
    { to: "/inicio", label: "Início" },
    { to: "/financas", label: "Finanças" },
    { to: "/avarias", label: "Avarias" },
    { to: "/modulos", label: "Módulos" },
    { to: "/perfil", label: "Perfil" },
  ],
  "administrador": [
    { to: "/inicio", label: "Início" },
    { to: "/financas", label: "Finanças" },
    { to: "/avarias", label: "Avarias" },
    { to: "/modulos", label: "Módulos" },
    { to: "/perfil", label: "Perfil" },
  ],
  "técnico": [
    { to: "/inicio", label: "Início" },
    { to: "/avarias", label: "Avarias" },
    { to: "/recibo", label: "Recibo" },
    { to: "/orcamentos", label: "Orçamentos" },
    { to: "/perfil", label: "Perfil" },
  ],
  "limpezas": [
    { to: "/inicio", label: "Início" },
    { to: "/avarias", label: "Avarias" },
    { to: "/recibo", label: "Recibo" },
    { to: "/perfil", label: "Perfil" },
  ],
  "contabilista": [
    { to: "/inicio", label: "Início" },
    { to: "/movimentos", label: "Movimentos" },
    { to: "/recibo", label: "Recibo" },
    { to: "/perfil", label: "Perfil" },
  ],
  "auditor": [
    { to: "/inicio", label: "Início" },
    { to: "/auditoria", label: "Auditoria" },
    { to: "/recibo", label: "Recibo" },
    { to: "/perfil", label: "Perfil" },
  ],
  "juridico": [
    { to: "/inicio", label: "Início" },
    { to: "/documentos", label: "Documentos" },
    { to: "/recibo", label: "Recibo" },
    { to: "/perfil", label: "Perfil" },
  ],
};

export default function BottomBar({ role }) {
  const items = itemsByRole[role] ?? itemsByRole["condómino"];

  return (
    <div className="bottom-bar">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className="bottom-item">
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
`);

write("pwa/src/BottomBar.css", `
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #111;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #333;
}
.bottom-item {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
}
.bottom-item.active {
  color: #fff;
  font-weight: 600;
}
`);
// ============================================================
// 3. Supabase Client
// ============================================================

write("pwa/src/supabaseClient.js", `
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
`);


// ============================================================
// 4. Router por perfil
// ============================================================

write("pwa/src/router.jsx", `
import { Routes, Route } from "react-router-dom";
import DashboardAdministrador from "./pages/administrador/DashboardAdministrador.jsx";
import DashboardCondomino from "./pages/condomino/DashboardCondomino.jsx";
import DashboardGestor from "./pages/gestor/DashboardGestor.jsx";
import DashboardTecnico from "./pages/tecnico/DashboardTecnico.jsx";
import DashboardLimpezas from "./pages/limpezas/DashboardLimpezas.jsx";
import DashboardContabilista from "./pages/contabilista/DashboardContabilista.jsx";
import DashboardAuditor from "./pages/auditor/DashboardAuditor.jsx";
import DashboardJuridico from "./pages/juridico/DashboardJuridico.jsx";

export default function AppRouter({ role }) {
  const routes = {
    administrador: <DashboardAdministrador />,
    "condómino": <DashboardCondomino />,
    gestor: <DashboardGestor />,
    técnico: <DashboardTecnico />,
    limpezas: <DashboardLimpezas />,
    contabilista: <DashboardContabilista />,
    auditor: <DashboardAuditor />,
    juridico: <DashboardJuridico />,
  };

  return (
    <Routes>
      <Route path="/*" element={routes[role] ?? <div>Perfil desconhecido</div>} />
    </Routes>
  );
}
`);


// ============================================================
// 5. App.jsx final (com fetch real do Supabase)
// ============================================================

write("pwa/src/App.jsx", `
import React, { useEffect, useState } from "react";
import AppRouter from "./router.jsx";
import BottomBar from "./BottomBar.jsx";
import { supabase } from "./supabaseClient.js";

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const r = data?.user?.user_metadata?.role;
      setRole(r);
    });
  }, []);

  if (!role) return <div>Carregando...</div>;

  return (
    <>
      <AppRouter role={role} />
      <BottomBar role={role} />
    </>
  );
}
`);


// ============================================================
// 6. Criar pastas e dashboards por perfil
// ============================================================

const perfis = [
  "administrador",
  "condomino",
  "gestor",
  "tecnico",
  "limpezas",
  "contabilista",
  "auditor",
  "juridico"
];

perfis.forEach((p) => {
  const nomeClasse = p.charAt(0).toUpperCase() + p.slice(1);

  write(`pwa/src/pages/${p}/Dashboard${nomeClasse}.jsx`, `
import React from "react";

export default function Dashboard${nomeClasse}() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard ${nomeClasse}</h2>
      <p>Conteúdo real será carregado aqui.</p>
    </div>
  );
}
`);
});
// ============================================================
// 7. Hook genérico para fetch ao Supabase
// ============================================================

write("pwa/src/hooks/useSupabaseList.js", `
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export function useSupabaseList(table, select = "*", match = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from(table).select(select);

    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    query.then(({ data, error }) => {
      if (!error) setData(data || []);
      setLoading(false);
    });
  }, [table, select, JSON.stringify(match)]);

  return { data, loading };
}
`);
// ============================================================
// 8. Conteúdo básico por dashboard (usa tabelas reais)
// ============================================================

write("pwa/src/pages/condomino/DashboardCondomino.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardCondomino() {
  const { data: movimentos, loading } = useSupabaseList("financeiro_movimentos");

  if (loading) return <div style={{ padding: "20px" }}>A carregar movimentos...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Movimentos financeiros</h2>
      {movimentos.length === 0 && <p>Sem movimentos registados.</p>}
      <ul>
        {movimentos.map((m) => (
          <li key={m.id}>
            {m.descricao || "Sem descrição"} — {m.valor} €
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/gestor/DashboardGestor.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardGestor() {
  const { data: incidencias, loading } = useSupabaseList("incidencias");

  if (loading) return <div style={{ padding: "20px" }}>A carregar incidências...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incidências em aberto</h2>
      {incidencias.length === 0 && <p>Sem incidências.</p>}
      <ul>
        {incidencias.map((i) => (
          <li key={i.id}>
            {i.titulo || "Sem título"} — {i.estado || "sem estado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/tecnico/DashboardTecnico.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardTecnico() {
  const { data: intervencoes, loading } = useSupabaseList("intervencoes");

  if (loading) return <div style={{ padding: "20px" }}>A carregar intervenções...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Intervenções técnicas</h2>
      {intervencoes.length === 0 && <p>Sem intervenções.</p>}
      <ul>
        {intervencoes.map((i) => (
          <li key={i.id}>
            {i.descricao || "Sem descrição"} — {i.estado || "sem estado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/limpezas/DashboardLimpezas.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardLimpezas() {
  const { data: tarefas, loading } = useSupabaseList("tarefas");

  if (loading) return <div style={{ padding: "20px" }}>A carregar tarefas...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tarefas de limpeza</h2>
      {tarefas.length === 0 && <p>Sem tarefas.</p>}
      <ul>
        {tarefas.map((t) => (
          <li key={t.id}>
            {t.titulo || "Sem título"} — {t.estado || "sem estado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/contabilista/DashboardContabilista.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardContabilista() {
  const { data: logs, loading } = useSupabaseList("logs_financeiros");

  if (loading) return <div style={{ padding: "20px" }}>A carregar logs financeiros...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Logs financeiros</h2>
      {logs.length === 0 && <p>Sem logs.</p>}
      <ul>
        {logs.map((l) => (
          <li key={l.id}>
            {l.acao || "Sem ação"} — {l.data || ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/auditor/DashboardAuditor.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardAuditor() {
  const { data: auditoria, loading } = useSupabaseList("auditoria");

  if (loading) return <div style={{ padding: "20px" }}>A carregar auditoria...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registos de auditoria</h2>
      {auditoria.length === 0 && <p>Sem registos.</p>}
      <ul>
        {auditoria.map((a) => (
          <li key={a.id}>
            {a.acao || "Sem ação"} — {a.data || ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);

write("pwa/src/pages/juridico/DashboardJuridico.jsx", `
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardJuridico() {
  const { data: docs, loading } = useSupabaseList("documentos");

  if (loading) return <div style={{ padding: "20px" }}>A carregar documentos...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Documentos jurídicos</h2>
      {docs.length === 0 && <p>Sem documentos.</p>}
      <ul>
        {docs.map((d) => (
          <li key={d.id}>
            {d.titulo || "Sem título"} — {d.tipo || "sem tipo"}
          </li>
        ))}
      </ul>
    </div>
  );
}
`);
