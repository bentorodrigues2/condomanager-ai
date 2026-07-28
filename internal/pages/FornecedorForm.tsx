import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarFornecedor,
  obterFornecedor,
  atualizarFornecedor,
} from "../services/fornecedores";
import { useNavigate, useParams } from "react-router-dom";

export default function FornecedorForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    servico: "",
    observacoes: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterFornecedor(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarFornecedor(id, form);
    else await criarFornecedor(form);

    navigate("/fornecedores");
  }

  return (
    <div>
      <h1>{id ? "Editar Fornecedor" : "Novo Fornecedor"}</h1>

      <input
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={alterar}
      />

      <input
        name="telefone"
        placeholder="Telefone"
        value={form.telefone}
        onChange={alterar}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={alterar}
      />

      <input
        name="servico"
        placeholder="Serviço Prestado"
        value={form.servico}
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

