
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNotifications } from '../context/NotificationContext';

export default function useRealtimeNotifications() {
  const { push } = useNotifications();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
        const table = payload.table;
        const row = payload.new;

        if (table === 'intervencoes') {
          push('Nova intervenção adicionada: ' + row.descricao);
        }

        if (table === 'obras') {
          push('Nova obra registada: ' + row.descricao);
        }

        if (table === 'limpezas') {
          push('Nova limpeza agendada: ' + row.descricao);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
