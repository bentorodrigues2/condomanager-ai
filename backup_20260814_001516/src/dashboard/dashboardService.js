import { supabase } from '../supabase/authClient';

export async function getDashboardStats() {
  const stats = {
    predios: 0,
    fracoes: 0,
    condominos: 0,
    pagamentosPendentes: 0,
  };

  const { count: predios } = await supabase.from('predios').select('*', { count: 'exact' });
  const { count: fracoes } = await supabase.from('fracoes').select('*', { count: 'exact' });
  const { count: condominos } = await supabase.from('condominos').select('*', { count: 'exact' });
  const { count: pendentes } = await supabase.from('pagamentos').select('*', { count: 'exact' }).eq('estado', 'pendente');

  stats.predios = predios || 0;
  stats.fracoes = fracoes || 0;
  stats.condominos = condominos || 0;
  stats.pagamentosPendentes = pendentes || 0;

  return stats;
}
