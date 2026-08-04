
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardJuridico() {
  const { data: docs, loading } = useSupabaseList("documentos");

  if (loading) return <div style={{ padding: "20px" }}>A carregar documentos...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Documentos jurídicos</h2>
      {docs.length === 0 && <p>Sem documentos.</p>}
      <ul>
        {docs.map((d) => (
          <li key={d.id}>
            {d.titulo || "Sem título"} — {d.tipo || "sem tipo"}
          </li>
        ))}
      </ul>
    </div>
  );
}
