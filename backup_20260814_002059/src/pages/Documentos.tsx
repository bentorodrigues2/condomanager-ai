import React, { useEffect, useState } from "react";
import { listarDocumentos, removerDocumento } from "../services/documentos";
import { Link } from "react-router-dom";

export default function Documentos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await listarDocumentos();
    setData(data || []);
  }

  async function remover(id) {
    await removerDocumento(id);
    carregar();
  }

  return (
    <div>
      <h1>Documentos</h1>

      <Link to="/documentos/novo">Novo Documento</Link>

      <ul>
        {data.map((d) => (
          <li key={d.id}>
            {d.data} — {d.titulo} — {d.tipo}
            <Link to={`/documentos/${d.id}`}>Editar</Link>
            <button onClick={() => remover(d.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

