import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarCondominos, removerCondomino } from "../services/condominos";
import { Link } from "react-router-dom";

export default function Condominos() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarCondominos();
    setData(data || []);
  }

  async function remover(id) {
    await removerCondomino(id);
    carregar();
  }

  return (
    <div>
      <h1>Condóminos</h1>

      {canAccess('gestor') && <Link to="/condominos/novo">Novo Condómino</Link>

      <ul>
        {data.map((c) => (
          <li key={c.id}>
            {c.nome} — {c.email} — {c.telefone}
            {canAccess('gestor') && <Link to={`/condominos/${c.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(c.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

