
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Reservas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("reservas_espacos")
      .select("*")
      .order("data", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Reservas de Espaços</h1>
      <ul>
        {lista.map((r) => (
          <li key={r.id}>
            {r.espaco} — {r.data} — {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
