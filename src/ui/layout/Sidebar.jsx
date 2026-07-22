
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
