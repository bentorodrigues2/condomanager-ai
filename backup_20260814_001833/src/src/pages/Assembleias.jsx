
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Assembleias() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("assembleias")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Assembleias</h1>

      <ul>
        {lista.map((a) => (
          <li key={a.id}>
            {a.titulo} — {a.data}
          </li>
        ))}
      </ul>
    </div>
  );
}
