
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
