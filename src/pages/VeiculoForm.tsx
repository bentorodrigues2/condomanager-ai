import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarVeiculo,
  obterVeiculo,
  atualizarVeiculo,
} from "../services/veiculos";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function VeiculoForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    matricula: "",
    marca: "",
    modelo: "",
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
    const { data } = await obterVeiculo(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarVeiculo(id, form);
    else await criarVeiculo(form);

    navigate("/veiculos");
  }

  return (
    <div>
      <h1>{id ? "Editar Veículo" : "Novo Veículo"}</h1>

      <input
        name="matricula"
        placeholder="Matrícula"
        value={form.matricula}
        onChange={alterar}
      />

      <input
        name="marca"
        placeholder="Marca"
        value={form.marca}
        onChange={alterar}
      />

      <input
        name="modelo"
        placeholder="Modelo"
        value={form.modelo}
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

