import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarPagamento,
  obterPagamento,
  atualizarPagamento,
} from "../services/pagamentos";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function PagamentoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    data: "",
    valor: "",
    condomino_id: "",
    fracao_id: "",
  });

  const [condominos, setCondominos] = useState([]);
  const [fracoes, setFracoes] = useState([]);

  useEffect(() => {
    carregarAuxiliares();
    if (id) carregar();
  }, [id]);

  async function carregarAuxiliares() {
    const { data: c } = await supabase.from("condominos").select("*");
    const { data: f } = await supabase.from("fracoes").select("*");
    setCondominos(c || []);
    setFracoes(f || []);
  }

  async function carregar() {
    const { data } = await obterPagamento(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarPagamento(id, form);
    else await criarPagamento(form);

    navigate("/pagamentos");
  }

  return (
    <div>
      <h1>{id ? "Editar Pagamento" : "Novo Pagamento"}</h1>

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <input
        name="valor"
        type="number"
        placeholder="Valor (€)"
        value={form.valor}
        onChange={alterar}
      />

      <select name="condomino_id" value={form.condomino_id} onChange={alterar}>
        <option value="">Selecionar Condómino...</option>
        {condominos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      <select name="fracao_id" value={form.fracao_id} onChange={alterar}>
        <option value="">Selecionar Fração...</option>
        {fracoes.map((f) => (
          <option key={f.id} value={f.id}>
            {f.code}
          </option>
        ))}
      </select>

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

