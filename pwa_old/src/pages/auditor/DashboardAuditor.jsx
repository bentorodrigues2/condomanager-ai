
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
