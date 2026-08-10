
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardGestor() {
  const { data: incidencias, loading } = useSupabaseList("incidencias");

  if (loading) return <div style={{ padding: "20px" }}>A carregar incidências...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incidências em aberto</h2>
      {incidencias.length === 0 && <p>Sem incidências.</p>}
      <ul>
        {incidencias.map((i) => (
          <li key={i.id}>
            {i.titulo || "Sem título"} — {i.estado || "sem estado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
