import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarUtilizadores, removerUtilizador } from "../services/utilizadores";
import { Link } from "react-router-dom";

export default function Utilizadores() { return (<PageGuard role='gestor'>) {
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

      {canAccess('gestor') && <Link to="/utilizadores/novo">Novo Utilizador</Link>

      <ul>
        {data.map((u) => (
          <li key={u.id}>
            {u.nome} — {u.email} — {u.papel} — {u.condominos?.nome}
            {canAccess('gestor') && <Link to={`/utilizadores/${u.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(u.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

