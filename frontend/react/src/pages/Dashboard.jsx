
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { supabase } = useAuth();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    supabase
      .from("vw_financas_condominio")
      .select("*")
      .then(({ data }) => setDados(data?.[0] || null));
  }, []);

  if (!dados) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Dashboard Financeiro</h1>

      <p><strong>Total Despesas:</strong> {dados.total_despesas}€</p>
      <p><strong>Total Pagamentos:</strong> {dados.total_pagamentos}€</p>
      <p><strong>Saldo:</strong> {dados.saldo}€</p>
    </div>
  );
}
