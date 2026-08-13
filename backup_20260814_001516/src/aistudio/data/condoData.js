import supabase from '../supabase';

export async function getExpenses() {
  return await supabase.from('expenses').select('*').order('date', { ascending: false });
}

export async function getDocuments() {
  return await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
}

export async function getOwners() {
  return await supabase.from('owners').select('*');
}

export async function getAssemblies() {
  return await supabase.from('assemblies').select('*').order('date', { ascending: false });
}

export async function getBalances() {
  return await supabase.from('balances').select('*');
}
