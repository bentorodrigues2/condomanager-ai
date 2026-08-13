import React, { useEffect, useState } from "react";
import { listarContratos, removerContrato } from "../services/contratos";
import { Link } from "react-router-dom";

export default function Contratos() {
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

      <Link to="/contratos/novo">Novo Contrato</Link>

      <ul>
        {data.map((c) => (
          <li key={c.id}>
            {c.fornecedores?.nome} — {c.servico} — {c.data_inicio} a {c.data_fim}
            <Link to={`/contratos/${c.id}`}>Editar</Link>
            <button onClick={() => remover(c.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

