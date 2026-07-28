import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarSeguros, removerSeguro } from "../services/seguros";
import { Link } from "react-router-dom";

export default function Seguros() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarSeguros();
    setData(data || []);
  }

  async function remover(id) {
    await removerSeguro(id);
    carregar();
  }

  return (
    <div>
      <h1>Seguros / Apólices</h1>

      {canAccess('gestor') && <Link to="/seguros/novo">Novo Seguro</Link>

      <ul>
        {data.map((s) => (
          <li key={s.id}>
            {s.fornecedores?.nome} — {s.tipo} — {s.data_inicio} a {s.data_fim}
            {canAccess('gestor') && <Link to={`/seguros/${s.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(s.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

