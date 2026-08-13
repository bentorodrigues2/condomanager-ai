import React, { useState } from 'react';
import { supabase } from '../../supabase/authClient';

export default function Login() {
  const [email, setEmail] = useState('');

  async function login() {
    await supabase.auth.signInWithOtp({ email });
    alert('Verifique o seu email para entrar.');
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login AI Studio</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />
      <button onClick={login} style={{ marginLeft: 10, padding: 10 }}>
        Entrar
      </button>
    </div>
  );
}
