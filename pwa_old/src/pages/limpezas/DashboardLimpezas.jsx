
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
