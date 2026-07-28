import PageGuard from '../middleware/PageGuard';
import React, { useEffect, useState } from "react";
import { createFraction, getFraction, updateFraction } from "../services/fractionsService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function FractionForm() { return (<PageGuard role='gestor'>) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const buildingId = params.get("building");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    typology: "",
    area: "",
    floor: "",
    building_id: buildingId
  });

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    const { data } = await getFraction(id);
    setForm(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    if (id) await updateFraction(id, form);
    else await createFraction(form);

    navigate(`/buildings/${buildingId}/fractions`);
  }

  return (
    <div>
      <h1>{id ? "Editar FraÃ§Ã£o" : "Nova FraÃ§Ã£o"}</h1>

      <input name="code" placeholder="CÃ³digo" value={form.code} onChange={handleChange} />
      <input name="typology" placeholder="Tipologia" value={form.typology} onChange={handleChange} />
      <input name="area" placeholder="Ãrea (mÂ²)" value={form.area} onChange={handleChange} />
      <input name="floor" placeholder="Piso" value={form.floor} onChange={handleChange} />

      {canAccess('gestor') && <button onClick={save}>Guardar</button>
    </div></PageGuard>)
  );
}
