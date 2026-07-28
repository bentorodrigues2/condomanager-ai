import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarVeiculos, removerVeiculo } from "../services/veiculos";
import { Link } from "react-router-dom";

export default function Veiculos() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarVeiculos();
    setData(data || []);
  }

  async function remover(id) {
    await removerVeiculo(id);
    carregar();
  }

  return (
    <div>
      <h1>Veículos</h1>

      {canAccess('gestor') && <Link to="/veiculos/novo">Novo Veículo</Link>

      <ul>
        {data.map((v) => (
          <li key={v.id}>
            {v.matricula} — {v.marca} {v.modelo} — {v.condominos?.nome}
            {canAccess('gestor') && <Link to={`/veiculos/${v.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(v.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

