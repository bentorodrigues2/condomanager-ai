
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Condominios() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("condominios")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Condomínios</h1>

      <ul>
        {lista.map((c) => (
          <li key={c.id}>
            {c.nome} — {c.morada}
          </li>
        ))}
      </ul>
    </div>
  );
}
