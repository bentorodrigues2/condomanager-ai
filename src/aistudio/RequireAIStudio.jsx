import { useEffect, useState } from 'react';
import supabase from './supabase';

export default function RequireAIStudio({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        setAllowed(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_studio_enabled')
        .eq('id', user.id)
        .single();

      setAllowed(profile?.ai_studio_enabled === true);
    });
  }, []);

  if (allowed === null) return <div>Loading...</div>;
  if (!allowed) return <div>Acesso negado.</div>;

  return children;
}
