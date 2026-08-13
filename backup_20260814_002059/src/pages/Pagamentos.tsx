import React, { useEffect, useState } from "react";
import { listarPagamentos, removerPagamento } from "../services/pagamentos";
import { Link } from "react-router-dom";

export default function Pagamentos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarPagamentos();
    setData(data || []);
  }

  async function remover(id) {
    await removerPagamento(id);
    carregar();
  }

  return (
    <div>
      <h1>Pagamentos</h1>

      <Link to="/pagamentos/novo">Novo Pagamento</Link>

      <ul>
        {data.map((p) => (
          <li key={p.id}>
            {p.data} � {p.valor}� � {p.condominos?.nome} � Fra��o {p.fracoes?.code}
            <Link to={`/pagamentos/${p.id}`}>Editar</Link>
            <button onClick={() => remover(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

