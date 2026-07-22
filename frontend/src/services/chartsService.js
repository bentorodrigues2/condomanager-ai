
import { supabase } from './supabaseClient';

export async function getIntervencoesPorEstado() {
  const { data } = await supabase.from('intervencoes').select('estado');
  const counts = {};

  data.forEach(i => {
    counts[i.estado] = (counts[i.estado] || 0) + 1;
  });

  return counts;
}

export async function getObrasPorEstado() {
  const { data } = await supabase.from('obras').select('estado');
  const counts = {};

  data.forEach(o => {
    counts[o.estado] = (counts[o.estado] || 0) + 1;
  });

  return counts;
}

export async function getLimpezasPorMes() {
  const { data } = await supabase.from('limpezas').select('data');
  const counts = {};

  data.forEach(l => {
    const mes = new Date(l.data).getMonth() + 1;
    counts[mes] = (counts[mes] || 0) + 1;
  });

  return counts;
}

export async function getFinanceiroResumo() {
  const { data } = await supabase.from('financeiro_movimentos').select('tipo, valor');
  let receitas = 0;
  let despesas = 0;

  data.forEach(m => {
    if (m.tipo === 'receita') receitas += Number(m.valor);
    if (m.tipo === 'despesa') despesas += Number(m.valor);
  });

  return { receitas, despesas };
}
