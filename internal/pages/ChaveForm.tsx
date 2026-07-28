import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarChave,
  obterChave,
  atualizarChave,
} from "../services/chaves";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function ChaveForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    codigo: "",
    condomino_id: "",
    data_entrega: "",
    data_devolucao: "",
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
    const { data } = await obterChave(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarChave(id, form);
    else await criarChave(form);

    navigate("/chaves");
  }

  return (
    <div>
      <h1>{id ? "Editar Chave" : "Nova Chave"}</h1>

      <input
        name="tipo"
        placeholder="Tipo (Portão, Porta, Garagem...)"
        value={form.tipo}
        onChange={alterar}
      />

      <input
        name="codigo"
        placeholder="Código / Número"
        value={form.codigo}
        onChange={alterar}
      />

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
        name="data_entrega"
        type="date"
        value={form.data_entrega}
        onChange={alterar}
      />

      <input
        name="data_devolucao"
        type="date"
        value={form.data_devolucao}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

