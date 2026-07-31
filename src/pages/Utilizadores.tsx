import React, { useEffect, useState } from "react";
import { listarUtilizadores, removerUtilizador } from "../services/utilizadores";
import { Link } from "react-router-dom";

export default function Utilizadores() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarUtilizadores();
    setData(data || []);
  }

  async function remover(id) {
    await removerUtilizador(id);
    carregar();
  }

  return (
    <div>
      <h1>Utilizadores / Administração</h1>

      <Link to="/utilizadores/novo">Novo Utilizador</Link>

      <ul>
        {data.map((u) => (
          <li key={u.id}>
            {u.nome} — {u.email} — {u.papel} — {u.condominos?.nome}
            <Link to={`/utilizadores/${u.id}`}>Editar</Link>
            <button onClick={() => remover(u.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

