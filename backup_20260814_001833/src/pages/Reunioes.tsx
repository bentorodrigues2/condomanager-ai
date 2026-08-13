import React, { useEffect, useState } from "react";
import { listarReunioes, removerReuniao } from "../services/reunioes";
import { Link } from "react-router-dom";

export default function Reunioes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarReunioes();
    setData(data || []);
  }

  async function remover(id) {
    await removerReuniao(id);
    carregar();
  }

  return (
    <div>
      <h1>Reuniões / Assembleias</h1>

      <Link to="/reunioes/novo">Nova Reunião</Link>

      <ul>
        {data.map((r) => (
          <li key={r.id}>
            {r.data} — {r.tipo} — {r.local}
            <Link to={`/reunioes/${r.id}`}>Editar</Link>
            <button onClick={() => remover(r.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

