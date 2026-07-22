import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarIncidente,
  obterIncidente,
  atualizarIncidente,
} from "../services/incidentes";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function IncidenteForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    data: "",
    estado: "pendente",
    fracao_id: "",
    condomino_id: "",
  });

  const [fracoes, setFracoes] = useState([]);
  const [condominos, setCondominos] = useState([]);

  useEffect(() => {
    carregarAuxiliares();
    if (id) carregar();
  }, [id]);

  async function carregarAuxiliares() {
    const { data: f } = await supabase.from("fracoes").select("*");
    const { data: c } = await supabase.from("condominos").select("*");
    setFracoes(f || []);
    setCondominos(c || []);
  }

  async function carregar() {
    const { data } = await obterIncidente(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarIncidente(id, form);
    else await criarIncidente(form);

    navigate("/incidentes");
  }

  return (
    <div>
      <h1>{id ? "Editar Incidente" : "Novo Incidente"}</h1>

      <input
        name="tipo"
        placeholder="Tipo (Ruído, Avaria, Infiltração...)"
        value={form.tipo}
        onChange={alterar}
      />

      <textarea
        name="descricao"
        placeholder="Descrição detalhada"
        value={form.descricao}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <select name="estado" value={form.estado} onChange={alterar}>
        <option value="pendente">Pendente</option>
        <option value="em curso">Em Curso</option>
        <option value="resolvido">Resolvido</option>
      </select>

      <select name="fracao_id" value={form.fracao_id} onChange={alterar}>
        <option value="">Selecionar Fração...</option>
        {fracoes.map((f) => (
          <option key={f.id} value={f.id}>
            {f.numero}
          </option>
        ))}
      </select>

      <select name="condomino_id" value={form.condomino_id} onChange={alterar}>
        <option value="">Selecionar Condómino...</option>
        {condominos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

