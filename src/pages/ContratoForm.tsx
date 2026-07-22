import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarContrato,
  obterContrato,
  atualizarContrato,
} from "../services/contratos";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function ContratoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fornecedor_id: "",
    servico: "",
    valor: "",
    data_inicio: "",
    data_fim: "",
    observacoes: "",
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
    const { data } = await obterContrato(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarContrato(id, form);
    else await criarContrato(form);

    navigate("/contratos");
  }

  return (
    <div>
      <h1>{id ? "Editar Contrato" : "Novo Contrato"}</h1>

      <select
        name="fornecedor_id"
        value={form.fornecedor_id}
        onChange={alterar}
      >
        <option value="">Selecionar Fornecedor...</option>
        {fornecedores.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nome}
          </option>
        ))}
      </select>

      <input
        name="servico"
        placeholder="Serviço contratado"
        value={form.servico}
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
        name="observacoes"
        placeholder="Observações"
        value={form.observacoes}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

