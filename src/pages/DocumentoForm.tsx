import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarDocumento,
  obterDocumento,
  atualizarDocumento,
} from "../services/documentos";
import { useNavigate, useParams } from "react-router-dom";

export default function DocumentoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    tipo: "",
    data: "",
    observacoes: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterDocumento(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarDocumento(id, form);
    else await criarDocumento(form);

    navigate("/documentos");
  }

  return (
    <div>
      <h1>{id ? "Editar Documento" : "Novo Documento"}</h1>

      <input
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={alterar}
      />

      <input
        name="tipo"
        placeholder="Tipo de Documento"
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
        name="observacoes"
        placeholder="Observações"
        value={form.observacoes}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

