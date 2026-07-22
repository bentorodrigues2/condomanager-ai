import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarSeguro,
  obterSeguro,
  atualizarSeguro,
} from "../services/seguros";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function SeguroForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fornecedor_id: "",
    tipo: "",
    valor: "",
    data_inicio: "",
    data_fim: "",
    cobertura: "",
  });

  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    carregarAuxiliares();
    if (id) carregar();
  }, [id]);

  async function carregarAuxiliares() {
    const { data } = await supabase.from("fornecedores").select("*");
    setFornecedores(data || []);
  }

  async function carregar() {
    const { data } = await obterSeguro(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarSeguro(id, form);
    else await criarSeguro(form);

    navigate("/seguros");
  }

  return (
    <div>
      <h1>{id ? "Editar Seguro" : "Novo Seguro"}</h1>

      <select
        name="fornecedor_id"
        value={form.fornecedor_id}
        onChange={alterar}
      >
        <option value="">Selecionar Seguradora...</option>
        {fornecedores.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nome}
          </option>
        ))}
      </select>

      <input
        name="tipo"
        placeholder="Tipo de seguro (Incêndio, Multirriscos...)"
        value={form.tipo}
        onChange={alterar}
      />

      <input
        name="valor"
        placeholder="Valor (€)"
        value={form.valor}
        onChange={alterar}
      />

      <input
        name="data_inicio"
        type="date"
        value={form.data_inicio}
        onChange={alterar}
      />

      <input
        name="data_fim"
        type="date"
        value={form.data_fim}
        onChange={alterar}
      />

      <textarea
        name="cobertura"
        placeholder="Cobertura / Condições"
        value={form.cobertura}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

