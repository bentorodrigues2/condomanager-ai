
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Fornecedores() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("fornecedores")
      .select("*")
      .order("nome", { ascending: true })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Fornecedores</h1>
      <ul>
        {lista.map((f) => (
          <li key={f.id}>
            {f.nome} — {f.tipo} — {f.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
}
