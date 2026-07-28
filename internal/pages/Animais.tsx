import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarAnimais, removerAnimal } from "../services/animais";
import { Link } from "react-router-dom";

export default function Animais() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarAnimais();
    setData(data || []);
  }

  async function remover(id) {
    await removerAnimal(id);
    carregar();
  }

  return (
    <div>
      <h1>Animais</h1>

      {canAccess('gestor') && <Link to="/animais/novo">Novo Animal</Link>

      <ul>
        {data.map((a) => (
          <li key={a.id}>
            {a.nome} — {a.especie} — {a.condominos?.nome}
            {canAccess('gestor') && <Link to={`/animais/${a.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(a.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

