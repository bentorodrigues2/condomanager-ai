import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarPagamentos, removerPagamento } from "../services/pagamentos";
import { Link } from "react-router-dom";

export default function Pagamentos() { return (<PageGuard role='gestor'>) {
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

      {canAccess('gestor') && <Link to="/pagamentos/novo">Novo Pagamento</Link>

      <ul>
        {data.map((p) => (
          <li key={p.id}>
            {p.data} — {p.valor}€ — {p.condominos?.nome} — Fração {p.fracoes?.code}
            {canAccess('gestor') && <Link to={`/pagamentos/${p.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

