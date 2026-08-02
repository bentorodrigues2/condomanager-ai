
import { supabase } from './supabaseClient';
import { askAI } from './aiService';

export async function executarTarefasAutomaticas() {
  const hoje = new Date().toISOString().split('T')[0];

  // Limpezas agendadas
  const { data: limpezas } = await supabase
    .from('limpezas')
    .select('*')
    .eq('data', hoje);

  if (limpezas.length > 0) {
    await supabase.from('ia_logs').insert({
      utilizador: 'sistema',
      acao: 'limpeza_hoje',
      detalhes: JSON.stringify(limpezas)
    });
  }

  // Obras atrasadas
  const { data: obras } = await supabase
    .from('obras')
    .select('*')
    .eq('estado', 'atrasada');

  if (obras.length > 0) {
    await supabase.from('ia_logs').insert({
      utilizador: 'sistema',
      acao: 'obras_atrasadas',
      detalhes: JSON.stringify(obras)
    });
  }

  // Análise IA diária
  const analise = await askAI("Resumo diário do condomínio.");
  await supabase.from('ia_logs').insert({
    utilizador: 'sistema',
    acao: 'analise_diaria',
    detalhes: analise
  });
}
