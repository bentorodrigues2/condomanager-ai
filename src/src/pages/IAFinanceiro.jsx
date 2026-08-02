
import { useState } from "react";

export default function IAFinanceiro() {
  const [resultado, setResultado] = useState(null);

  async function prever() {
    const resp = await fetch("/api/ia/financeiro/prever", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condominio_id: "1", mes: "2026-07" })
    });

    const json = await resp.json();
    setResultado(json);
  }

  return (
    <div>
      <h1>IA Financeira</h1>
      <button onClick={prever}>Gerar Previsão</button>
      {resultado && (
        <pre>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
}
