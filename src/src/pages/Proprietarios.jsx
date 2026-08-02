
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Proprietarios() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("proprietarios")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Proprietários</h1>

      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.nome} — {p.email} — {p.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
}
