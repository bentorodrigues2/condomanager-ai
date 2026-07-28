import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarPredio,
  obterPredio,
  atualizarPredio,
} from "../services/predios";
import { useNavigate, useParams } from "react-router-dom";

export default function PredioForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    morada: "",
    nif: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterPredio(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarPredio(id, form);
    else await criarPredio(form);

    navigate("/predios");
  }

  return (
    <div>
      <h1>{id ? "Editar Prédio" : "Novo Prédio"}</h1>

      <input
        name="nome"
        placeholder="Nome do Prédio"
        value={form.nome}
        onChange={alterar}
      />

      <input
        name="morada"
        placeholder="Morada"
        value={form.morada}
        onChange={alterar}
      />

      <input
        name="nif"
        placeholder="NIF"
        value={form.nif}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

