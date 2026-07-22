
import { useState } from "react";

export default function IAOperacional() {
  const [resultado, setResultado] = useState(null);

  async function sugerir() {
    const resp = await fetch("/api/ia/operacional/sugerir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condominio_id: "1", tipo: "manutencao" })
    });

    const json = await resp.json();
    setResultado(json);
  }

  return (
    <div>
      <h1>IA Operacional</h1>
      <button onClick={sugerir}>Gerar Sugestão</button>
      {resultado && (
        <pre>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
}
