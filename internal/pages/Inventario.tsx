import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { listarInventario, removerItemInventario } from "../services/inventario";
import { Link } from "react-router-dom";

export default function Inventario() { return (<PageGuard role='gestor'>) {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarInventario();
    setData(data || []);
  }

  async function remover(id) {
    await removerItemInventario(id);
    carregar();
  }

  return (
    <div>
      <h1>Inventário / Equipamentos</h1>

      {canAccess('gestor') && <Link to="/inventario/novo">Novo Equipamento</Link>

      <ul>
        {data.map((i) => (
          <li key={i.id}>
            {i.nome} — {i.localizacao} — {i.estado} — {i.fornecedores?.nome}
            {canAccess('gestor') && <Link to={`/inventario/${i.id}`}>Editar</Link>
            {canAccess('gestor') && <button onClick={() => remover(i.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div></PageGuard>)
  );
}

