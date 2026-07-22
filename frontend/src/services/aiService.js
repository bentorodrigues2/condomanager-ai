
import { supabase } from './supabaseClient';

export async function askAI(prompt) {
  // Chamada ao Supabase AI Studio
  const { data, error } = await supabase.functions.invoke('ai', {
    body: { prompt }
  });

  // Log automático
  await supabase.from('ia_logs').insert({
    utilizador: 'frontend',
    acao: 'askAI',
    detalhes: prompt
  });

  if (error) return 'Erro ao comunicar com IA.';
  return data?.response || 'Sem resposta.';
}
