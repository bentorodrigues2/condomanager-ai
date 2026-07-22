import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarExportacoes, removerExportacao } from "../services/exportacoes";
import { Link } from "react-router-dom";

export default function Exportacoes() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarExportacoes();
    setData(data || []);
  }

  async function remover(id) {
    await removerExportacao(id);
    carregar();
  }

  return (
    <div>
      <h1>Exportações / Relatórios</h1>

      {canAccess('gestor') && <Link to="/exportacoes/novo">Nova Exportação</Link>

      <ul>
        {data.map((e) => (
          <li key={e.id}>
            {e.data} — {e.tipo} — {e.descricao}
            {canAccess('gestor') && <Link to={`/exportacoes/${e.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(e.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

