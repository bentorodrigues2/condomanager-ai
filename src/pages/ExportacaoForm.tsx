import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarExportacao,
  obterExportacao,
  atualizarExportacao,
} from "../services/exportacoes";
import { useNavigate, useParams } from "react-router-dom";

export default function ExportacaoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    data: "",
    descricao: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterExportacao(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarExportacao(id, form);
    else await criarExportacao(form);

    navigate("/exportacoes");
  }

  return (
    <div>
      <h1>{id ? "Editar Exportação" : "Nova Exportação"}</h1>

      <input
        name="tipo"
        placeholder="Tipo de Exportação"
        value={form.tipo}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
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

