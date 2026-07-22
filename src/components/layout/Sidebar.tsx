import { NavLink } from "react-router-dom";
import { theme } from "../../styles/theme";

export function Sidebar() {
  return (
    <aside style={{
      width: "260px",
      background: theme.colors.sidebar,
      padding: theme.spacing.lg,
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing.md
    }}>
      <NavLink to="/" style={{ color: "white" }}>Dashboard</NavLink>
      <NavLink to="/condominios" style={{ color: "white" }}>Condomínios</NavLink>
      <NavLink to="/financeiro" style={{ color: "white" }}>Financeiro</NavLink>
      <NavLink to="/manutencao" style={{ color: "white" }}>Manutenção</NavLink>
      <NavLink to="/unidades" style={{ color: "white" }}>Unidades</NavLink>
      <NavLink to="/configuracoes" style={{ color: "white" }}>Configurações</NavLink>
      <NavLink to="/ia/avancada" style={{ color: "white" }}>IA Avançada</NavLink>
      <NavLink to="/simulador" style={{ color: "white" }}>Simulador PWA</NavLink>
    </aside>
  );
}








