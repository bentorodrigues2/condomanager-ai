import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarReuniao,
  obterReuniao,
  atualizarReuniao,
} from "../services/reunioes";
import { useNavigate, useParams } from "react-router-dom";

export default function ReuniaoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    data: "",
    local: "",
    descricao: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterReuniao(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarReuniao(id, form);
    else await criarReuniao(form);

    navigate("/reunioes");
  }

  return (
    <div>
      <h1>{id ? "Editar Reunião" : "Nova Reunião"}</h1>

      <input
        name="tipo"
        placeholder="Tipo de Reunião (Ordinária, Extraordinária...)"
        value={form.tipo}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <input
        name="local"
        placeholder="Local"
        value={form.local}
        onChange={alterar}
      />

      <textarea
        name="descricao"
        placeholder="Descrição / Observações"
        value={form.descricao}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

