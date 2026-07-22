import { supabase } from '../supabaseClient';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  supabase.auth.signOut();
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
