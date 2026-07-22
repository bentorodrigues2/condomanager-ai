import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarMensagens, removerMensagem } from "../services/mensagens";
import { Link } from "react-router-dom";

export default function Mensagens() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarMensagens();
    setData(data || []);
  }

  async function remover(id) {
    await removerMensagem(id);
    carregar();
  }

  return (
    <div>
      <h1>Mensagens Internas / Chat</h1>

      {canAccess('gestor') && <Link to="/mensagens/novo">Nova Mensagem</Link>

      <ul>
        {data.map((m) => (
          <li key={m.id}>
            {m.data} — {m.condominos?.nome}: {m.titulo}
            {canAccess('gestor') && <Link to={`/mensagens/${m.id}`}>Ver / Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(m.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

