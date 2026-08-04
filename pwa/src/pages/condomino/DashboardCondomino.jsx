
import React from "react";
import { useSupabaseList } from "../../hooks/useSupabaseList.js";

export default function DashboardCondomino() {
  const { data: movimentos, loading } = useSupabaseList("financeiro_movimentos");

  if (loading) return <div style={{ padding: "20px" }}>A carregar movimentos...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Movimentos financeiros</h2>
      {movimentos.length === 0 && <p>Sem movimentos registados.</p>}
      <ul>
        {movimentos.map((m) => (
          <li key={m.id}>
            {m.descricao || "Sem descrição"} — {m.valor} €
          </li>
        ))}
      </ul>
    </div>
  );
}
