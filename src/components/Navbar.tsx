import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#1e293b", padding: "12px", display: "flex", gap: "20px" }}>
      <Link style={{ color: "white" }} to="/">Dashboard</Link>
      <Link style={{ color: "white" }} to="/predios">Prédios</Link>
      <Link style={{ color: "white" }} to="/fracoes">Frações</Link>
      <Link style={{ color: "white" }} to="/condominos">Condóminos</Link>
      <Link style={{ color: "white" }} to="/pagamentos">Pagamentos</Link>
    </nav>
  );
}








