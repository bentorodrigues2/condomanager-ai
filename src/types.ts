export interface Predio {
  id_predio: string;
  nome?: string;
  morada_linha1: string;
  morada_linha2?: string;
  codigo_postal?: string;
  localidade?: string;
}

export interface Fracao {
  id_fracao: string;
  id_predio: string;
  designacao: string;
  area?: number;
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








