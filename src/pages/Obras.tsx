import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarObras, removerObra } from "../services/obras";
import { Link } from "react-router-dom";

export default function Obras() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarObras();
    setData(data || []);
  }

  async function remover(id) {
    await removerObra(id);
    carregar();
  }

  return (
    <div>
      <h1>Obras / Intervenções</h1>

      {canAccess('gestor') && <Link to="/obras/novo">Nova Obra</Link>

      <ul>
        {data.map((o) => (
          <li key={o.id}>
            {o.data} — {o.titulo} — {o.custo}€
            {canAccess('gestor') && <Link to={`/obras/${o.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(o.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

