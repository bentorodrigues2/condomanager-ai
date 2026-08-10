
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardTecnico() {
  const { data: intervencoes, loading } = useSupabaseList("intervencoes");

  if (loading) return <div style={{ padding: "20px" }}>A carregar intervenções...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Intervenções técnicas</h2>
      {intervencoes.length === 0 && <p>Sem intervenções.</p>}
      <ul>
        {intervencoes.map((i) => (
          <li key={i.id}>
            {i.descricao || "Sem descrição"} — {i.estado || "sem estado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
