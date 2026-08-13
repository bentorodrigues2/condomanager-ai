import React, { useEffect, useState } from "react";
import { listarFornecedores, removerFornecedor } from "../services/fornecedores";
import { Link } from "react-router-dom";

export default function Fornecedores() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarFornecedores();
    setData(data || []);
  }

  async function remover(id) {
    await removerFornecedor(id);
    carregar();
  }

  return (
    <div>
      <h1>Fornecedores</h1>

      <Link to="/fornecedores/novo">Novo Fornecedor</Link>

      <ul>
        {data.map((f) => (
          <li key={f.id}>
            {f.nome} — {f.telefone} — {f.email}
            <Link to={`/fornecedores/${f.id}`}>Editar</Link>
            <button onClick={() => remover(f.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

