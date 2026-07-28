import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarUtilizador,
  obterUtilizador,
  atualizarUtilizador,
} from "../services/utilizadores";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function UtilizadorForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    papel: "admin",
    condomino_id: "",
  });

  const [condominos, setCondominos] = useState([]);

  useEffect(() => {
    carregarAuxiliares();
    if (id) carregar();
  }, [id]);

  async function carregarAuxiliares() {
    const { data } = await supabase.from("condominos").select("*");
    setCondominos(data || []);
  }

  async function carregar() {
    const { data } = await obterUtilizador(id);
    setForm({ ...data, senha: "" });
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    const payload = { ...form };
    if (!payload.senha) delete payload.senha;

    if (id) await atualizarUtilizador(id, payload);
    else await criarUtilizador(payload);

    navigate("/utilizadores");
  }

  return (
    <div>
      <h1>{id ? "Editar Utilizador" : "Novo Utilizador"}</h1>

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
        name="senha"
        type="password"
        placeholder={id ? "Nova senha (opcional)" : "Senha"}
        value={form.senha}
        onChange={alterar}
      />

      <select name="papel" value={form.papel} onChange={alterar}>
        <option value="admin">Administrador</option>
        <option value="gestor">Gestor</option>
        <option value="leitura">Leitura</option>
      </select>

      <select
        name="condomino_id"
        value={form.condomino_id}
        onChange={alterar}
      >
        <option value="">Associar a Condómino (opcional)</option>
        {condominos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      {canAccess('gestor') && <button onClick={guardar}>Guardar</button>
    </div></PageGuard>)
  );
}

