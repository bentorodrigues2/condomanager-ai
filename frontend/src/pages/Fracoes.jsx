
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Fracoes() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("fracoes")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Frações</h1>

      <ul>
        {lista.map((f) => (
          <li key={f.id}>
            {f.identificador} — Área: {f.area} — Permilagem: {f.permilagem}
          </li>
        ))}
      </ul>
    </div>
  );
}
