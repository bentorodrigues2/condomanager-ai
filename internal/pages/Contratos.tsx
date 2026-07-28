import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarContratos, removerContrato } from "../services/contratos";
import { Link } from "react-router-dom";

export default function Contratos() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarContratos();
    setData(data || []);
  }

  async function remover(id) {
    await removerContrato(id);
    carregar();
  }

  return (
    <div>
      <h1>Contratos</h1>

      {canAccess('gestor') && <Link to="/contratos/novo">Novo Contrato</Link>

      <ul>
        {data.map((c) => (
          <li key={c.id}>
            {c.fornecedores?.nome} — {c.servico} — {c.data_inicio} a {c.data_fim}
            {canAccess('gestor') && <Link to={`/contratos/${c.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(c.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

