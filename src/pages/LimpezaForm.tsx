import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarLimpeza,
  obterLimpeza,
  atualizarLimpeza,
} from "../services/limpezas";
import { useNavigate, useParams } from "react-router-dom";

export default function LimpezaForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    data: "",
    responsavel: "",
    custo: "",
    observacoes: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterLimpeza(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarLimpeza(id, form);
    else await criarLimpeza(form);

    navigate("/limpezas");
  }

  return (
    <div>
      <h1>{id ? "Editar Limpeza" : "Nova Limpeza"}</h1>

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <input
        name="responsavel"
        placeholder="Responsável"
        value={form.responsavel}
        onChange={alterar}
      />

      <input
        name="custo"
        type="number"
        placeholder="Custo (€)"
        value={form.custo}
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

