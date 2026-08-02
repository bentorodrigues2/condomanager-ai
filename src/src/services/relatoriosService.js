
import { supabase } from './supabaseClient';
import { askAI } from './aiService';

export async function gerarRelatorio(tipo) {
  const texto = await askAI("Gerar relatório em formato PDF sobre: " + tipo);

  await supabase.from('historico_eventos').insert({
    entidade: 'relatorio',
    entidade_id: Date.now(),
    acao: 'gerado',
    detalhes: tipo
  });

  return texto;
}
