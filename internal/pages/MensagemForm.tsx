import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarMensagem,
  obterMensagem,
  atualizarMensagem,
} from "../services/mensagens";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function MensagemForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    condomino_id: "",
    titulo: "",
    mensagem: "",
    data: "",
  });

  const [condominos, setCondominos] = useState([]);

  useEffect(() => {
    carregarAuxiliares();
    if (id) carregar();
  }, [id]);

  async function carregarAuxiliares() {
    const { data } = await supabase.from("condominos").select("*");
    setCondominos(data || []);
  }

  async function carregar() {
    const { data } = await obterMensagem(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarMensagem(id, form);
    else await criarMensagem(form);

    navigate("/mensagens");
  }

  return (
    <div>
      <h1>{id ? "Editar Mensagem" : "Nova Mensagem"}</h1>

      <select
        name="condomino_id"
        value={form.condomino_id}
        onChange={alterar}
      >
        <option value="">Selecionar Condómino...</option>
        {condominos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      <input
        name="titulo"
        placeholder="Título da mensagem"
        value={form.titulo}
        onChange={alterar}
      />

      <textarea
        name="mensagem"
        placeholder="Mensagem"
        value={form.mensagem}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

