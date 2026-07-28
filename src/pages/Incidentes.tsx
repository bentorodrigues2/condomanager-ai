import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarIncidentes, removerIncidente } from "../services/incidentes";
import { Link } from "react-router-dom";

export default function Incidentes() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarIncidentes();
    setData(data || []);
  }

  async function remover(id) {
    await removerIncidente(id);
    carregar();
  }

  return (
    <div>
      <h1>Incidentes / Ocorrências</h1>

      {canAccess('gestor') && <Link to="/incidentes/novo">Novo Incidente</Link>

      <ul>
        {data.map((i) => (
          <li key={i.id}>
            {i.data} — {i.tipo} — {i.estado} — Fração {i.fracoes?.numero}
            {canAccess('gestor') && <Link to={`/incidentes/${i.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(i.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

