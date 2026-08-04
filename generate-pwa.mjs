import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Corrigir __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function write(file, content) {
  const full = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("✔ Criado:", file);
}

// ============================================================
// 1. Criar estrutura base React/Vite
// ============================================================

write("pwa/index.html", `
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <title>CondoManager AI</title>
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
// 2. Criar router + guards
// ============================================================

write("pwa/src/router.jsx", `
import { Navigate } from "react-router-dom";

export function guard(role, allowed) {
  return allowed.includes(role);
}

export function ProtectedRoute({ role, allowed, children }) {
  if (!guard(role, allowed)) return <Navigate to="/bloqueado" />;
  return children;
}
`);

// ============================================================
// 3. Criar dashboard em cards
// ============================================================

write("pwa/src/Dashboard.jsx", `
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ modules }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="cards-grid">
        {modules.map((m) => (
          <div key={m.id} className={"card " + m.status} onClick={() => navigate(m.route)}>
            <div className="card-icon">{m.icon}</div>
            <div className="card-title">{m.title}</div>
            <div className="card-status">{m.statusLabel}</div>
            {m.badge && <div className="card-badge">{m.badge}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
`);

write("pwa/src/Dashboard.css", `
.dashboard-container { padding: 16px; padding-bottom: 80px; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
.card { background: #1e1e1e; border-radius: 14px; padding: 16px; color: white; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.card-icon { font-size: 28px; }
.card-title { font-size: 16px; font-weight: 600; }
.card-status { font-size: 12px; opacity: 0.7; }
.card-badge { position: absolute; top: 8px; right: 8px; background: #ff3b30; padding: 4px 8px; border-radius: 10px; font-size: 10px; }
.ATIVA { border-left: 4px solid #4cd964; }
.PENDENTE { border-left: 4px solid #ffcc00; }
.NOVA { border-left: 4px solid #007aff; }
.REGULARIZADO { border-left: 4px solid #34c759; }
.EMREGULARIZACAO { border-left: 4px solid #ff9500; }
`);

// ============================================================
// 4. Criar barra inferior
// ============================================================

write("pwa/src/BottomBar.jsx", `
import { NavLink } from "react-router-dom";
import "./BottomBar.css";

export default function BottomBar() {
  return (
    <div className="bottom-bar">
      <NavLink to="/financas" className="bottom-item">💰 Finanças</NavLink>
      <NavLink to="/atividades" className="bottom-item">📅 Atividades</NavLink>
      <NavLink to="/menu" className="bottom-item">📂 Menu</NavLink>
      <NavLink to="/perfil" className="bottom-item">👤 Perfil</NavLink>
    </div>
  );
}
`);

write("pwa/src/BottomBar.css", `
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 60px; background: #111; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #333; }
.bottom-item { color: #ccc; text-decoration: none; font-size: 14px; }
.bottom-item.active { color: #fff; font-weight: 600; }
`);

// ============================================================
// 5. Criar App.jsx com dashboard + barra inferior
// ============================================================

write("pwa/src/App.jsx", `
import Dashboard from "./Dashboard.jsx";
import BottomBar from "./BottomBar.jsx";

export default function App() {
  const modules = [
    { id: 1, title: "Comunicação", icon: "💬", status: "ATIVA", statusLabel: "ATIVA", route: "/comunicacao" },
    { id: 2, title: "Arquivo Digital", icon: "📁", status: "REGULARIZADO", statusLabel: "REGULARIZADO", route: "/arquivo" },
    { id: 3, title: "Reservas", icon: "📅", status: "NOVA", statusLabel: "NOVA", route: "/reservas" },
    { id: 4, title: "Limpezas", icon: "🧹", status: "EMREGULARIZACAO", statusLabel: "EM REGULARIZAÇÃO", route: "/limpezas", badge: 2 },
    { id: 5, title: "Fornecedores", icon: "🏢", status: "ATIVA", statusLabel: "ATIVA", route: "/fornecedores" },
    { id: 6, title: "Sondagens", icon: "📊", status: "PENDENTE", statusLabel: "PENDENTE", route: "/sondagens" },
    { id: 7, title: "Obras", icon: "🚧", status: "ATIVA", statusLabel: "ATIVA", route: "/obras" },
  ];

  return (
    <>
      <Dashboard modules={modules} />
      <BottomBar />
    </>
  );
}
`);

console.log("🎉 PWA gerada automaticamente!");
