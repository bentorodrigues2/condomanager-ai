import React, { useEffect, useState } from "react";
import { listarObras, removerObra } from "../services/obras";
import { Link } from "react-router-dom";

export default function Obras() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarObras();
    setData(data || []);
  }

  async function remover(id) {
    await removerObra(id);
    carregar();
  }

  return (
    <div>
      <h1>Obras / Intervenções</h1>

      <Link to="/obras/novo">Nova Obra</Link>

      <ul>
        {data.map((o) => (
          <li key={o.id}>
            {o.data} — {o.titulo} — {o.custo}€
            <Link to={`/obras/${o.id}`}>Editar</Link>
            <button onClick={() => remover(o.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

