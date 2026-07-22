import { Predio, Conta, Fornecedor, Fracao, Aviso, Movimento, Reuniao, Documento, Ocorrencia } from "../types";

export const cpLookup: Record<string, string> = {
  "2840-124": "Seixal",
  "2775-245": "Parede",
  "1000-001": "Lisboa",
  "4000-001": "Porto",
  "8000-001": "Faro",
  "2780-001": "Oeiras",
  "2845-351": "Amora"
};

export const initialPredios: Predio[] = [
  {
    id_predio: "predio-1",
    nome: "EdifÃ­cio Estrela da Barra",
    morada_linha1: "Rua Bento Rodrigues",
    morada_linha2: "Apt 2B",
    num_porta: "2",
    letra_porta: "A",
    codigo_postal: "2840-124",
    localidade: "Seixal",
    nif: "900123456",
    iban: "PT50 0035 0123 4567 8901 2344 5",
    patrimonio: {
      tem_elevador: true,
      num_elevadores: 2,
      tem_garagem: true,
      tem_piscina: false,
      tem_sala_comum: true,
      tem_arrecadacoes_comuns: true,
      tem_jardins: true,
      tem_churrasqueira: false,
      tem_terraco: false,
      tem_ginasio: false,
      tem_spa: false
    }
  }
];

export const initialContas: Conta[] = [
  {
    id_conta: "cta-1",
    id_predio: "predio-1",
    banco: "Caixa Geral de DepÃ³sitos",
    iban: "PT50 0035 0123 4567 8901 2344 5",
    tipo: "Ordem (GestÃ£o Corrente)",
    saldo: 4850.25,
    balcao: "Amora Centro",
    morada_balcao: "Avenida da RepÃºblica, 14, Amora",
    contacto_banco: "219 013 112",
    gestor_contas: "Dr. AntÃ³nio Fontes"
  },
  {
    id_conta: "cta-2",
    id_predio: "predio-1",
    banco: "CGD PoupanÃ§a CondomÃ­nio",
    iban: "PT50 0035 0123 4567 8901 9999 1",
    tipo: "Fundo Comum de Reserva (FCR)",
    saldo: 12350.75,
    balcao: "Amora Centro",
    morada_balcao: "Avenida da RepÃºblica, 14, Amora",
    contacto_banco: "219 013 112",
    gestor_contas: "Dr. AntÃ³nio Fontes"
  }
];

export const initialFornecedores: Fornecedor[] = [
  {
    id_fornecedor: "forn-1",
    id_predio: "predio-1",
    nome: "EDP Comercial",
    nif: "500697340",
    iban: "PT50 0033 0000 1234 5678 9012 3",
    categoria: "Eletricidade Escadas/Elevadores",
    morada: "Avenida 24 de Julho, 12, Lisboa",
    contacto: "808 535 353",
    pessoa_contacto: "Departamento de Clientes Empresariais"
  },
  {
    id_fornecedor: "forn-2",
    id_predio: "predio-1",
    nome: "OTIS Elevadores",
    nif: "500112233",
    iban: "PT50 0003 4444 5555 6666 7777 8",
    categoria: "ManutenÃ§Ã£o Elevadores",
    morada: "Praceta de AlgÃ©s, 4, Oeiras",
    contacto: "214 156 000",
    pessoa_contacto: "Eng. Rui Barreiro"
  }
];

export const initialFracoes: Fracao[] = [
  {
    id_fracao: "frac-1",
    id_predio: "predio-1",
    fracao_nome: "A",
    piso: "R/C Esq",
    permilagem: 150,
    tipologia: "Residencial",
    tipo_access: "Acesso Comum pelas Escadas",
    tem_garagem_spot: true,
    tem_arrecadacao_box: true,
    is_arrendada: true,
    administrador_interno: "NÃ£o",
    notificacao_preferencial: "Digital (E-mail e Mensagens Push)",
    proprietario: {
      nome: "Ana Silva",
      nif: "221230475",
      email: "ana.silva@gmail.com",
      tlm: "963456789",
      iban: "PT50 0035 0999 8888 7777 6666 5",
      titular_conta: "Ana Maria Silva",
      entidade_bancaria: "Caixa Geral de DepÃ³sitos",
      morada_alternativa: "Avenida da Liberdade 12, 4Âº Dto, Lisboa",
      foto: null,
      data_nascimento: "1988-04-12"
    },
    inquilino: {
      nome: "Ricardo Inquilino",
      email: "ricardo.loc@gmail.com",
      tlm: "929887766",
      nif: "255667788",
      foto: null
    },
    seguradora: "Tranquilidade Seguros",
    apolice_num: "TRQ-9988221",
    apolice_validade: "2026-08-15"
  },
  {
    id_fracao: "frac-2",
    id_predio: "predio-1",
    fracao_nome: "B",
    piso: "R/C Dto (Loja)",
    permilagem: 100,
    tipologia: "Loja Comercial",
    tipo_access: "Acesso Direto pelo Exterior sem Escadas",
    tem_garagem_spot: false,
    tem_arrecadacao_box: false,
    is_arrendada: false,
    administrador_interno: "NÃ£o",
    notificacao_preferencial: "Correio Postal (FÃ­sico)",
    proprietario: {
      nome: "Carlos Administrador",
      nif: "201334992",
      email: "carlos.adm@condomanager.pt",
      tlm: "912345678",
      iban: "PT50 0018 2222 3333 4444 5555 6",
      titular_conta: "Carlos Alberto Ferreira",
      entidade_bancaria: "Santander Totta",
      morada_alternativa: null,
      foto: null
    },
    inquilino: null
  },
  {
    id_fracao: "frac-3",
    id_predio: "predio-1",
    fracao_nome: "K",
    piso: "3Âº Esq",
    permilagem: 175,
    tipologia: "Residencial",
    tipo_access: "Acesso Comum pelas Escadas",
    tem_garagem_spot: true,
    tem_arrecadacao_box: true,
    is_arrendada: false,
    administrador_interno: "Sim",
    notificacao_preferencial: "Digital (E-mail e Mensagens Push)",
    proprietario: {
      nome: "JosÃ© Carlos Alves Guerra",
      nif: "221230475",
      email: "jose.guerra@outlook.pt",
      tlm: "931223344",
      iban: "PT50 0003 9999 8888 1111 2222 3",
      titular_conta: "JosÃ© Carlos Guerra",
      entidade_bancaria: "Millennium BCP",
      morada_alternativa: null,
      foto: null
    },
    inquilino: null
  }
];

export const initialAvisos: Aviso[] = [
  { id_aviso: "av-6699", id_predio: "predio-1", id_fracao: "frac-1", tipo: "Cota OrdinÃ¡ria", data: "2026-05-01", vencimento: "2026-05-15", descricao: "Quota de CondomÃ­nio OrdinÃ¡ria - Maio / 2026", valor: 41.94, estado: "Pendente" },
  { id_aviso: "av-6716", id_predio: "predio-1", id_fracao: "frac-1", tipo: "Fundo de Reserva", data: "2026-05-01", vencimento: "2026-05-15", descricao: "Quota do Fundo Comum de Reserva - Maio / 2026", valor: 4.19, estado: "Pendente" },
  { id_aviso: "av-3", id_predio: "predio-1", id_fracao: "frac-2", tipo: "Cota OrdinÃ¡ria", data: "2026-05-01", vencimento: "2026-05-15", descricao: "Quota de CondomÃ­nio OrdinÃ¡ria - Maio / 2026 (Com Desconto Loja)", valor: 19.57, estado: "Pendente" }
];

export const initialMovements: Movimento[] = [
  { id_mov: "mov-1", id_predio: "predio-1", id_conta: "cta-1", data: "2026-05-02", tipo: "Receita", valor: 48.93, descricao: "Pagamento Cota 3Âº Esq - JosÃ© Guerra", categoria: "Quotas OrdinÃ¡rias" }
];

export const initialReunioes: Reuniao[] = [
  { id_reuniao: "reu-1", id_predio: "predio-1", data: "2026-08-10", hora: "21:00", tema: "Assembleia Geral OrdinÃ¡ria", ordens_trabalho: "1. AprovaÃ§Ã£o de contas de 2025;\n2. EleiÃ§Ã£o de administraÃ§Ã£o;\n3. OrÃ§amento de manutenÃ§Ã£o do telhado.", estado: "Agendada" }
];

export const initialDocumentos: Documento[] = [
  {
    id_doc: "doc-1",
    id_predio: "predio-1",
    nome: "Ata_Assembleia_Geral_Ordinaria_2025.pdf",
    tipo: "Atas",
    data_upload: "2025-01-15",
    tamanho: "1.2 MB",
    categoria: "Atas",
    descricao: "Ata oficial da Assembleia Geral OrdinÃ¡ria realizada para eleiÃ§Ã£o da administraÃ§Ã£o e aprovaÃ§Ã£o de contas de 2024.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "Assembleias & Atas",
    ano: "2025"
  },
  {
    id_doc: "doc-2",
    id_predio: "predio-1",
    nome: "Apolice_Multirriscos_Predio_2026.pdf",
    tipo: "Seguros do prÃ©dio",
    data_upload: "2026-01-05",
    tamanho: "3.4 MB",
    categoria: "Seguros do prÃ©dio",
    descricao: "ApÃ³lice de Seguro Multirriscos CondomÃ­nio Allianz - Cobertura global de paredes e Ã¡reas comuns.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "Seguros",
    ano: "2026"
  },
  {
    id_doc: "doc-3",
    id_predio: "predio-1",
    nome: "Regulamento_Interno_Condominio_Revisado.pdf",
    tipo: "Regulamentos",
    data_upload: "2024-03-20",
    tamanho: "850 KB",
    categoria: "Regulamentos",
    descricao: "Regulamento de condomÃ­nio em vigor, detalhando direitos, deveres, regras de ruÃ­do e utilizaÃ§Ã£o de espaÃ§os comuns.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "RegulamentaÃ§Ã£o",
    ano: "2024"
  },
  {
    id_doc: "doc-4",
    id_predio: "predio-1",
    nome: "Contrato_Manutencao_Elevadores_OTIS.pdf",
    tipo: "ServiÃ§os",
    data_upload: "2025-06-12",
    tamanho: "1.8 MB",
    categoria: "ServiÃ§os",
    descricao: "Contrato de PrestaÃ§Ã£o de ServiÃ§os de ManutenÃ§Ã£o Preventiva dos Elevadores (OTIS).",
    visibilidade: "AdministraÃ§Ã£o",
    autor: "Carlos Administrador",
    tema: "Contratos & ServiÃ§os",
    ano: "2025"
  },
  {
    id_doc: "doc-5",
    id_predio: "predio-1",
    nome: "Orcamento_Geral_Aprovado_Exercicio_2026.pdf",
    tipo: "OrÃ§amentos",
    data_upload: "2026-01-10",
    tamanho: "2.1 MB",
    categoria: "OrÃ§amentos",
    descricao: "Plano orÃ§amental detalhado aprovado para o ano corrente, com distribuiÃ§Ã£o de quotas mensais por fraÃ§Ã£o.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "Financeiro & OrÃ§amental",
    ano: "2026"
  },
  {
    id_doc: "doc-6",
    id_predio: "predio-1",
    nome: "Fatura_Reparacao_Infiltracao_Canalizacao.pdf",
    tipo: "ReparaÃ§Ãµes",
    data_upload: "2026-04-18",
    tamanho: "650 KB",
    categoria: "ReparaÃ§Ãµes",
    descricao: "Fatura detalhada dos trabalhos urgentes de canalizaÃ§Ã£o para estancar infiltraÃ§Ã£o no piso 1.",
    visibilidade: "AdministraÃ§Ã£o",
    autor: "Carlos Administrador",
    tema: "ManutenÃ§Ã£o & Obras",
    ano: "2026"
  },
  {
    id_doc: "doc-7",
    id_predio: "predio-1",
    nome: "Relatorio_Contas_Mensal_Dezembro_2025.pdf",
    tipo: "RelatÃ³rios de contas",
    data_upload: "2026-01-01",
    tamanho: "1.5 MB",
    categoria: "RelatÃ³rios de contas",
    descricao: "RelatÃ³rio de encerramento do exercÃ­cio financeiro do ano anterior, balancete e saldos finais bancÃ¡rios.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "Financeiro & OrÃ§amental",
    ano: "2025"
  },
  {
    id_doc: "doc-8",
    id_predio: "predio-1",
    nome: "Projeto_Reabilitacao_Fachada_Orcamentos.pdf",
    tipo: "Obras",
    data_upload: "2026-05-10",
    tamanho: "4.8 MB",
    categoria: "Obras",
    descricao: "Estudo tÃ©cnico e propostas comerciais para futura reabilitaÃ§Ã£o e pintura das fachadas exteriores do edifÃ­cio.",
    visibilidade: "PÃºblico",
    autor: "Carlos Administrador",
    tema: "ManutenÃ§Ã£o & Obras",
    ano: "2026"
  },
  {
    id_doc: "doc-9",
    id_predio: "predio-1",
    nome: "Ficha_Assistencia_Tecnica_Central_Incendio.pdf",
    tipo: "AssistÃªncias",
    data_upload: "2026-03-01",
    tamanho: "420 KB",
    categoria: "AssistÃªncias",
    descricao: "RelatÃ³rio de intervenÃ§Ã£o da vistoria semestral preventiva dos sistemas de incÃªndio e sinalizaÃ§Ã£o do prÃ©dio.",
    visibilidade: "AdministraÃ§Ã£o",
    autor: "Carlos Administrador",
    tema: "ManutenÃ§Ã£o & Obras",
    ano: "2026"
  },
  {
    id_doc: "doc-10",
    id_predio: "predio-1",
    nome: "Apolice_Seguro_Fracao_A_AnaSilva.pdf",
    tipo: "Seguros das fraÃ§Ãµes",
    data_upload: "2026-02-15",
    tamanho: "1.1 MB",
    categoria: "Seguros das fraÃ§Ãµes",
    descricao: "CÃ³pia da apÃ³lice obrigatÃ³ria de incÃªndio individual apresentada pela proprietÃ¡ria da FraÃ§Ã£o A.",
    visibilidade: "AdministraÃ§Ã£o",
    autor: "Carlos Administrador",
    tema: "Seguros",
    ano: "2026"
  }
];

export const initialOcorrencias: Ocorrencia[] = [
  { 
    id_ocorr: "oc-1", 
    id_predio: "predio-1", 
    id_fracao: "frac-1", // FraÃ§Ã£o A (Ana Silva)
    descricao: "InfiltraÃ§Ã£o grave no teto da casa de banho principal, vinda do andar superior.", 
    data: "2026-05-01", 
    estado: "Em ReparaÃ§Ã£o", 
    medidas_tomadas: "TÃ©cnico da empresa HydroStop localizou rotura na junta da banheira do 1Âº andar. Procedeu-se Ã  substituiÃ§Ã£o das tubagens danificadas.", 
    fotos: [],
    categoria: "InfiltraÃ§Ãµes",
    tecnico_atribuido: "HydroStop CanalizaÃ§Ãµes, Lda."
  },
  { 
    id_ocorr: "oc-2", 
    id_predio: "predio-1", 
    id_fracao: "frac-2", // FraÃ§Ã£o B (Bruno Costa)
    descricao: "LÃ¢mpadas tubulares do patamar do 2Âº andar estÃ£o a piscar e uma fundiu por completo.", 
    data: "2026-05-10", 
    estado: "ConcluÃ­da", 
    medidas_tomadas: "SubstituÃ­das as lÃ¢mpadas fluorescentes antigas por novas lÃ¢mpadas LED tubulares de alta eficiÃªncia.", 
    fotos: [],
    categoria: "Eletricidade",
    tecnico_atribuido: "EletroRÃ¡pido ReparaÃ§Ãµes"
  },
  { 
    id_ocorr: "oc-3", 
    id_predio: "predio-1", 
    id_fracao: "frac-3", // FraÃ§Ã£o C (Clara Duarte)
    descricao: "O elevador nÂº 2 (lado direito) apresenta ruÃ­do anormal durante a subida entre o 3Âº e o 5Âº piso.", 
    data: "2026-05-18", 
    estado: "OrÃ§amento", 
    medidas_tomadas: "Contacto estabelecido com a Otis Elevadores. TÃ©cnico realizou diagnÃ³stico tÃ©cnico preliminar e aguarda aprovaÃ§Ã£o da proposta comercial para substituiÃ§Ã£o dos cabos de traÃ§Ã£o.", 
    fotos: [],
    categoria: "Elevadores",
    tecnico_atribuido: "OTIS Elevadores Portugal"
  },
  { 
    id_ocorr: "oc-4", 
    id_predio: "predio-1", 
    id_fracao: "frac-1", // FraÃ§Ã£o A
    descricao: "PortÃ£o automÃ¡tico de acesso Ã  garagem comum do condomÃ­nio bloqueia a meio da abertura.", 
    data: "2026-05-20", 
    estado: "A aguardar", 
    medidas_tomadas: "Registado no sistema e aguardando deslocaÃ§Ã£o do piquete tÃ©cnico de automatismos.", 
    fotos: [],
    categoria: "Serralharia",
    tecnico_atribuido: "PortasFortes SeguranÃ§a"
  }
];








