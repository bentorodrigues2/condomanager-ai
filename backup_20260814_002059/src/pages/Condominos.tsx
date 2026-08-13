import React, { useEffect, useState } from "react";
import { listarCondominos, removerCondomino } from "../services/condominos";
import { Link } from "react-router-dom";

export default function Condominos() {
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
      <h1>Cond�minos</h1>

      <Link to="/condominos/novo">Novo Cond�mino</Link>

      <ul>
        {data.map((c) => (
          <li key={c.id}>
            {c.nome} � {c.email} � {c.telefone}
            <Link to={`/condominos/${c.id}`}>Editar</Link>
            <button onClick={() => remover(c.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

