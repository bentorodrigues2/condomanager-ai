
import { supabase } from './supabaseClient';

export async function sendMessage(channel, user, message) {
  await supabase.from('chat').insert({
    canal: channel,
    utilizador: user,
    mensagem: message
  });
}

export async function getMessages(channel) {
  const { data } = await supabase
    .from('chat')
    .select('*')
    .eq('canal', channel)
    .order('criado_em', { ascending: true });

  return data || [];
}
