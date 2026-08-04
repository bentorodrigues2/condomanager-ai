
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
