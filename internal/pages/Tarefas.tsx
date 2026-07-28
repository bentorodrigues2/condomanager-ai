import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarTarefas, removerTarefa } from "../services/tarefas";
import { Link } from "react-router-dom";

export default function Tarefas() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarTarefas();
    setData(data || []);
  }

  async function remover(id) {
    await removerTarefa(id);
    carregar();
  }

  return (
    <div>
      <h1>Tarefas / Manutenção</h1>

      {canAccess('gestor') && <Link to="/tarefas/novo">Nova Tarefa</Link>

      <ul>
        {data.map((t) => (
          <li key={t.id}>
            {t.data} — {t.titulo} — {t.estado}
            {canAccess('gestor') && <Link to={`/tarefas/${t.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(t.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

