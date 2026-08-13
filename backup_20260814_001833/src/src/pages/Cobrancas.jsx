
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Cobrancas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("cobrancas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Cobranças</h1>

      <ul>
        {lista.map((c) => (
          <li key={c.id}>
            {c.periodo} — {c.valor}€ — {c.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
