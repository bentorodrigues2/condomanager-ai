import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarAnimal,
  obterAnimal,
  atualizarAnimal,
} from "../services/animais";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AnimalForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    especie: "",
    raca: "",
    cor: "",
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
    const { data } = await obterAnimal(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarAnimal(id, form);
    else await criarAnimal(form);

    navigate("/animais");
  }

  return (
    <div>
      <h1>{id ? "Editar Animal" : "Novo Animal"}</h1>

      <input
        name="nome"
        placeholder="Nome"
        value={form.nome}
        onChange={alterar}
      />

      <input
        name="especie"
        placeholder="Espécie (Cão, Gato...)"
        value={form.especie}
        onChange={alterar}
      />

      <input
        name="raca"
        placeholder="Raça"
        value={form.raca}
        onChange={alterar}
      />

      <input
        name="cor"
        placeholder="Cor"
        value={form.cor}
        onChange={alterar}
      />

      <select
        name="condomino_id"
        value={form.condomino_id}
        onChange={alterar}
      >
        <option value="">Selecionar Condómino...</option>
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

