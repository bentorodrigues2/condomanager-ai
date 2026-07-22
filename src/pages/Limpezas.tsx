import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarLimpezas, removerLimpeza } from "../services/limpezas";
import { Link } from "react-router-dom";

export default function Limpezas() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarLimpezas();
    setData(data || []);
  }

  async function remover(id) {
    await removerLimpeza(id);
    carregar();
  }

  return (
    <div>
      <h1>Limpezas</h1>

      {canAccess('gestor') && <Link to="/limpezas/novo">Nova Limpeza</Link>

      <ul>
        {data.map((l) => (
          <li key={l.id}>
            {l.data} — {l.responsavel} — {l.custo}€
            {canAccess('gestor') && <Link to={`/limpezas/${l.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(l.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

