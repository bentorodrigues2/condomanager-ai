import { supabase } from '../supabase/authClient';

export async function getCondominios() {
  const { data, error } = await supabase
    .from('condominios')
    .select('id, nome, morada');

  if (error) {
    console.error('Erro ao carregar condomínios:', error);
    return [];
  }

  return data;
}

export function setCondominioAtual(id) {
  localStorage.setItem('condominio_atual', id);
}

export function getCondominioAtual() {
  return localStorage.getItem('condominio_atual');
}
