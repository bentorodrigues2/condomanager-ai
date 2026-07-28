import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import {
  criarReserva,
  obterReserva,
  atualizarReserva,
} from "../services/reservas";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function ReservaForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    espaco: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    condomino_id: "",
    observacoes: "",
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
    const { data } = await obterReserva(id);
    setForm(data);
  }

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar() {
    if (id) await atualizarReserva(id, form);
    else await criarReserva(form);

    navigate("/reservas");
  }

  return (
    <div>
      <h1>{id ? "Editar Reserva" : "Nova Reserva"}</h1>

      <input
        name="espaco"
        placeholder="Espaço (Sala, Churrasqueira, Piscina...)"
        value={form.espaco}
        onChange={alterar}
      />

      <input
        name="data"
        type="date"
        value={form.data}
        onChange={alterar}
      />

      <input
        name="hora_inicio"
        type="time"
        value={form.hora_inicio}
        onChange={alterar}
      />

      <input
        name="hora_fim"
        type="time"
        value={form.hora_fim}
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

