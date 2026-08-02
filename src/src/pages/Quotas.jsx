
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Quotas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("quotas")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Quotas</h1>

      <ul>
        {lista.map((q) => (
          <li key={q.id}>
            {q.periodo} — {q.valor}€ — {q.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
