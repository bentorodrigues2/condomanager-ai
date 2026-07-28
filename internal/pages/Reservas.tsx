import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarReservas, removerReserva } from "../services/reservas";
import { Link } from "react-router-dom";

export default function Reservas() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarReservas();
    setData(data || []);
  }

  async function remover(id) {
    await removerReserva(id);
    carregar();
  }

  return (
    <div>
      <h1>Reservas de Espaços</h1>

      {canAccess('gestor') && <Link to="/reservas/novo">Nova Reserva</Link>

      <ul>
        {data.map((r) => (
          <li key={r.id}>
            {r.data} — {r.espaco} — {r.hora_inicio} às {r.hora_fim} — {r.condominos?.nome}
            {canAccess('gestor') && <Link to={`/reservas/${r.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(r.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

