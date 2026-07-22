import { api } from './api';

export async function fetchDashboardSummary() {
  const response = await api.get('/dashboard/summary');
  return response.data;
}

export async function fetchCondominios() {
  const response = await api.get('/condominios');
  return response.data;
}

export async function fetchUnidades() {
  const response = await api.get('/unidades');
  return response.data;
}

export async function fetchFinanceiro() {
  const response = await api.get('/financeiro');
  return response.data;
}

export async function fetchManutencao() {
  const response = await api.get('/manutencao');
  return response.data;
}








