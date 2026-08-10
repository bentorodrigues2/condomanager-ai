
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
