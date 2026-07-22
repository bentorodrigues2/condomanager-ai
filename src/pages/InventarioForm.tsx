import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarItemInventario,
  obterItemInventario,
  atualizarItemInventario,
} from "../services/inventario";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function InventarioForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    localizacao: "",
    estado: "funcional",
    fornecedor_id: "",
    data_aquisicao: "",
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
    const { data } = await obterItemInventario(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarItemInventario(id, form);
    else await criarItemInventario(form);

    navigate("/inventario");
  }

  return (
    <div>
      <h1>{id ? "Editar Equipamento" : "Novo Equipamento"}</h1>

      <input
        name="nome"
        placeholder="Nome do equipamento"
        value={form.nome}
        onChange={alterar}
      />

      <input
        name="localizacao"
        placeholder="Localização (Sala técnica, Garagem...)"
        value={form.localizacao}
        onChange={alterar}
      />

      <select name="estado" value={form.estado} onChange={alterar}>
        <option value="funcional">Funcional</option>
        <option value="avariado">Avariado</option>
        <option value="substituido">Substituído</option>
      </select>

      <select
        name="fornecedor_id"
        value={form.fornecedor_id}
        onChange={alterar}
      >
        <option value="">Fornecedor...</option>
        {fornecedores.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nome}
          </option>
        ))}
      </select>

      <input
        name="data_aquisicao"
        type="date"
        value={form.data_aquisicao}
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

