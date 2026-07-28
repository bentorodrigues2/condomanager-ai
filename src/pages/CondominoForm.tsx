import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarCondomino,
  obterCondomino,
  atualizarCondomino,
} from "../services/condominos";
import { useNavigate, useParams } from "react-router-dom";

export default function CondominoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const { data } = await obterCondomino(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarCondomino(id, form);
    else await criarCondomino(form);

    navigate("/condominos");
  }

  return (
    <div>
      <h1>{id ? "Editar Condómino" : "Novo Condómino"}</h1>

      <input
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={alterar}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={alterar}
      />

      <input
        name="telefone"
        placeholder="Telefone"
        value={form.telefone}
        onChange={alterar}
      />

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

