import React, { useEffect, useState } from "react";
import { getFractions, deleteFraction } from "../services/fractionsService";
import { Link, useParams } from "react-router-dom";

export default function FractionsList() {
  const { buildingId } = useParams();
  const [fractions, setFractions] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await getFractions(buildingId);
    setFractions(data || []);
  }

  async function remove(id) {
    await deleteFraction(id);
    load();
  }

  return (
    <div>
      <h1>FraÃ§Ãµes</h1>
      <Link to={`/fractions/new?building=${buildingId}`}>Nova FraÃ§Ã£o</Link>

      <ul>
        {fractions.map((f) => (
          <li key={f.id}>
            {f.code} â€” {f.typology} â€” {f.area} mÂ²
            <Link to={`/fractions/${f.id}`}>Editar</Link>
            <button onClick={() => remove(f.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
