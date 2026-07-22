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

// UI folders
const uiDir = path.join(src, "ui");
const componentsDir = path.join(uiDir, "components");
const layoutDir = path.join(uiDir, "layout");
const themeDir = path.join(uiDir, "theme");

createDir(uiDir);
createDir(componentsDir);
createDir(layoutDir);
createDir(themeDir);

// GLOBAL THEME
createFile(
    path.join(themeDir, "theme.css"),
    `
:root {
    --bg: #f5f5f5;
    --bg-dark: #1e1e1e;
    --text: #222;
    --text-dark: #eee;
    --primary: #4a6cf7;
    --card-bg: #fff;
    --card-bg-dark: #2a2a2a;
}

body.light {
    background: var(--bg);
    color: var(--text);
}

body.dark {
    background: var(--bg-dark);
    color: var(--text-dark);
}
`
);

// SIDEBAR
createFile(
    path.join(layoutDir, "Sidebar.jsx"),
    `
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside style={{
            width: "220px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            padding: "20px",
            height: "100vh"
        }}>
            <h2>CondoManager</h2>
            <nav>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li><Link to="/admin">Admin</Link></li>
                    <li><Link to="/gestor">Gestor</Link></li>
                    <li><Link to="/condomino">Condomino</Link></li>
                    <li><Link to="/fornecedor">Fornecedor</Link></li>
                    <li><Link to="/limpezas">Limpezas</Link></li>
                    <li><Link to="/auditor">Auditor</Link></li>
                    <li><Link to="/contabilidade">Contabilidade</Link></li>
                </ul>
            </nav>
        </aside>
    );
}
`
);

// HEADER
createFile(
    path.join(layoutDir, "Header.jsx"),
    `
import { useAuth } from "../../auth/AuthContext";

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
            <div>
                <span style={{ marginRight: "15px" }}>
                    {user?.role}
                </span>
                <button onClick={logout}>Sair</button>
            </div>
        </header>
    );
}
`
);

// LAYOUT WRAPPER
createFile(
    path.join(layoutDir, "Layout.jsx"),
    `
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <main style={{ padding: "20px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
`
);

// COMPONENT: CARD
createFile(
    path.join(componentsDir, "Card.jsx"),
    `
export default function Card({ title, children }) {
    return (
        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            marginBottom: "20px"
        }}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
}
`
);

// COMPONENT: LOADER
createFile(
    path.join(componentsDir, "Loader.jsx"),
    `
export default function Loader() {
    return <p>A carregar...</p>;
}
`
);

// COMPONENT: TABLE
createFile(
    path.join(componentsDir, "Table.jsx"),
    `
export default function Table({ data }) {
    if (!data || data.length === 0) return <p>Sem dados.</p>;

    const keys = Object.keys(data[0]);

    return (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    {keys.map((k) => (
                        <th key={k}>{k}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                        {keys.map((k) => (
                            <td key={k}>{row[k]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
`
);

console.log("MODULE 4 — PART 1 COMPLETED");
console.log("Agora corre: node setup-v3-module4-part1.cjs");
