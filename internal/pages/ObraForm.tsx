import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarObra,
  obterObra,
  atualizarObra,
} from "../services/obras";
import { useNavigate, useParams } from "react-router-dom";

export default function ObraForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
    custo: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterObra(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarObra(id, form);
    else await criarObra(form);

    navigate("/obras");
  }

  return (
    <div>
      <h1>{id ? "Editar Obra" : "Nova Obra"}</h1>

      <input
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={alterar}
      />

      <textarea
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <input
        name="custo"
        type="number"
        placeholder="Custo (€)"
        value={form.custo}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

