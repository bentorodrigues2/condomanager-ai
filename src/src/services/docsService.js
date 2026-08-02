
import { supabase } from './supabaseClient';

export async function uploadDocument(file) {
  const fileName = Date.now() + '-' + file.name;

  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(fileName, file);

  if (error) return { error };

  const url = supabase.storage.from('documentos').getPublicUrl(fileName).data.publicUrl;

  await supabase.from('documentos').insert({
    nome: file.name,
    url
  });

  await supabase.from('historico_eventos').insert({
    entidade: 'documento',
    entidade_id: fileName,
    acao: 'upload',
    detalhes: file.name
  });

  return { url };
}

export async function listDocuments() {
  const { data } = await supabase.from('documentos').select('*');
  return data || [];
}
