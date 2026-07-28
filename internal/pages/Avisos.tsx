import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarAvisos, removerAviso } from "../services/avisos";
import { Link } from "react-router-dom";

export default function Avisos() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarAvisos();
    setData(data || []);
  }

  async function remover(id) {
    await removerAviso(id);
    carregar();
  }

  return (
    <div>
      <h1>Avisos / Comunicações</h1>

      {canAccess('gestor') && <Link to="/avisos/novo">Novo Aviso</Link>

      <ul>
        {data.map((a) => (
          <li key={a.id}>
            {a.data} — {a.titulo}
            {canAccess('gestor') && <Link to={`/avisos/${a.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(a.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

