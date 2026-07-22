import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarTarefa,
  obterTarefa,
  atualizarTarefa,
} from "../services/tarefas";
import { useNavigate, useParams } from "react-router-dom";

export default function TarefaForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    estado: "pendente",
    prioridade: "normal",
    responsavel: "",
    descricao: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterTarefa(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarTarefa(id, form);
    else await criarTarefa(form);

    navigate("/tarefas");
  }

  return (
    <div>
      <h1>{id ? "Editar Tarefa" : "Nova Tarefa"}</h1>

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

      <select name="estado" value={form.estado} onChange={alterar}>
        <option value="pendente">Pendente</option>
        <option value="em curso">Em Curso</option>
        <option value="concluída">Concluída</option>
      </select>

      <select name="prioridade" value={form.prioridade} onChange={alterar}>
        <option value="baixa">Baixa</option>
        <option value="normal">Normal</option>
        <option value="alta">Alta</option>
      </select>

      <input
        name="responsavel"
        placeholder="Responsável"
        value={form.responsavel}
        onChange={alterar}
      />

      <textarea
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

