import React, { useEffect, useState } from "react";
import { listarChaves, removerChave } from "../services/chaves";
import { Link } from "react-router-dom";

export default function Chaves() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarChaves();
    setData(data || []);
  }

  async function remover(id) {
    await removerChave(id);
    carregar();
  }

  return (
    <div>
      <h1>Chaves / Acessos</h1>

      <Link to="/chaves/novo">Nova Chave</Link>

      <ul>
        {data.map((c) => (
          <li key={c.id}>
            {c.tipo} — {c.codigo} — {c.condominos?.nome}
            <Link to={`/chaves/${c.id}`}>Editar</Link>
            <button onClick={() => remover(c.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

