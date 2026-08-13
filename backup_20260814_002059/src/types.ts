export interface Predio {
  id_predio: string;
  nome?: string;
  morada_linha1?: string;
  morada_linha2?: string;
  codigo_postal?: string;
  localidade?: string;
  num_porta?: string;
}

export interface Fracao {
  id_fracao: string;
  id_predio: string;
  designacao: string;
  area?: number;
  fracao_nome?: string;
}

export interface Condominio {
  id_condomino: string;
  id_fracao: string;
  nome: string;
  email: string;
  telefone?: string | null;
}

export interface Pagamento {
  id_pagamento: string;
  id_fracao: string;
  valor: number;
  data_pagamento: string;
  estado: "pendente" | "pago" | "atrasado";
}

export interface LoggedUser {
  id_user: string;
  nome: string;
  role: "ADMIN" | "USER";
}

export interface Conta {
  id?: string;
  nome?: string;
  iban?: string;
  saldo?: number;
}

export interface Fornecedor {
  id?: string;
  nome?: string;
  servico?: string;
  contacto?: string;
}

export interface Aviso {
  id?: string;
  titulo?: string;
  descricao?: string;
  data?: string;
}

export interface Movimento {
  id?: string;
  tipo?: string;
  valor?: number;
  descricao?: string;
  data?: string;
}

export interface Reuniao {
  id?: string;
  titulo?: string;
  data?: string;
  local?: string;
}

export interface Documento {
  id?: string;
  nome?: string;
  url?: string;
  categoria?: string;
}

export interface Ocorrencia {
  id?: string;
  titulo?: string;
  descricao?: string;
  estado?: string;
}
