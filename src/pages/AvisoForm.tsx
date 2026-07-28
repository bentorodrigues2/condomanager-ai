import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarAviso,
  obterAviso,
  atualizarAviso,
} from "../services/avisos";
import { useNavigate, useParams } from "react-router-dom";

export default function AvisoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    mensagem: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterAviso(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarAviso(id, form);
    else await criarAviso(form);

    navigate("/avisos");
  }

  return (
    <div>
      <h1>{id ? "Editar Aviso" : "Novo Aviso"}</h1>

      <input
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <textarea
        name="mensagem"
        placeholder="Mensagem"
        value={form.mensagem}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

