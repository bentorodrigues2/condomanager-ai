import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const registeredUsers = [
  {
    name: 'Administrador',
    email: 'admin@condomanager.ai',
    password: 'admin123',
    role: 'ADMIN',
  },
];

app.use(express.json());

// Shared Gemini client utility with telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email e password sÃ£o obrigatÃ³rios." });
  }

  const user = registeredUsers.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    return res.status(401).json({ error: "Credenciais invÃ¡lidas." });
  }

  return res.json({
    token: `demo-token-${user.email}`,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e password sÃ£o obrigatÃ³rios." });
  }

  const existing = registeredUsers.find((entry) => entry.email === email);
  if (existing) {
    return res.status(409).json({ error: "Este email jÃ¡ estÃ¡ registado." });
  }

  const user = { name, email, password, role: 'USER' as const };
  registeredUsers.push(user);

  return res.status(201).json({
    token: `demo-token-${email}`,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.post("/api/auth/recover", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email Ã© obrigatÃ³rio." });
  }

  return res.json({
    message: `Se o email ${email} estiver registado, serÃ¡ enviada uma instruÃ§Ã£o para redefinir a password.`,
  });
});

app.get("/api/dashboard/summary", (req, res) => {
  res.json({
    totalCondominios: 12,
    totalUnidades: 48,
    receitasMes: 3200,
    despesasMes: 1480,
    intervencoesPendentes: 5,
    limpezasPendentes: 3,
    atividadeRecente: [
      { title: 'Nova fatura registada', description: 'A fatura do fornecedor foi adicionada ao sistema.' },
      { title: 'IntervenÃ§Ã£o concluÃ­da', description: 'A intervenÃ§Ã£o de encanamento foi marcada como concluÃ­da.' },
      { title: 'Pedido de autorizaÃ§Ã£o recebido', description: 'Um novo pedido foi submetido para anÃ¡lise.' },
    ],
    alerts: [
      { title: 'Avisos', description: '2 alertas de manutenÃ§Ã£o pendente.' },
      { title: 'Erros', description: '1 comunicaÃ§Ã£o nÃ£o sincronizada.' },
      { title: 'NotificaÃ§Ãµes de Condomino', description: '4 mensagens novas por responder.' },
    ],
  });
});

app.get("/api/condominios", (req, res) => {
  res.json([
    { nome: 'Solar do Parque', morada: 'Rua das Flores, 10', unidades: 24, gestor: 'Ana Pereira', estado: 'Ativo' },
    { nome: 'Vila Nova', morada: 'Av. da Liberdade, 88', unidades: 18, gestor: 'MÃ¡rio Silva', estado: 'Pendente' },
    { nome: 'Monte Branco', morada: 'Travessa do Mar, 5', unidades: 32, gestor: 'JoÃ£o Costa', estado: 'Ativo' },
    { nome: 'Praia Azul', morada: 'Rua do Sol, 42', unidades: 15, gestor: 'Ana Pereira', estado: 'Inativo' },
    { nome: 'Jardim das AcÃ¡cias', morada: 'Alameda das Rosas, 21', unidades: 27, gestor: 'MÃ¡rio Silva', estado: 'Ativo' },
    { nome: 'Residencial Aurora', morada: 'Rua do Norte, 7', unidades: 20, gestor: 'JoÃ£o Costa', estado: 'Pendente' },
  ]);
});

app.get("/api/unidades", (req, res) => {
  res.json([
    { numero: 'A101', tipo: 'T2', proprietario: 'Ana Pereira', estado: 'Ocupada', atualizacao: 'Hoje, 09:30' },
    { numero: 'B205', tipo: 'T1', proprietario: 'MÃ¡rio Silva', estado: 'DisponÃ­vel', atualizacao: 'Ontem, 18:10' },
    { numero: 'C310', tipo: 'T3', proprietario: 'JoÃ£o Costa', estado: 'Em manutenÃ§Ã£o', atualizacao: 'Hoje, 14:00' },
    { numero: 'D402', tipo: 'T2', proprietario: 'Maria Lopes', estado: 'Ocupada', atualizacao: 'Hoje, 11:20' },
    { numero: 'E118', tipo: 'T1', proprietario: 'Carlos Mendes', estado: 'DisponÃ­vel', atualizacao: 'Ontem, 16:45' },
    { numero: 'F220', tipo: 'T4', proprietario: 'Sofia Ribeiro', estado: 'Ocupada', atualizacao: 'Hoje, 08:05' },
    { numero: 'G307', tipo: 'T3', proprietario: 'Rui Teixeira', estado: 'Em manutenÃ§Ã£o', atualizacao: 'HÃ¡ 2 dias' },
    { numero: 'H410', tipo: 'T2', proprietario: 'Paula Martins', estado: 'DisponÃ­vel', atualizacao: 'Hoje, 13:15' },
  ]);
});

app.get("/api/financeiro", (req, res) => {
  res.json({
    summary: {
      receitasMes: 3200,
      despesasMes: 1480,
      saldoAtual: 1720,
      movimentosPendentes: 6,
    },
    items: [
      { data: '05/07/2026', descricao: 'Receita condomÃ­nio', tipo: 'Receita', valor: 1200, estado: 'Pago' },
      { data: '04/07/2026', descricao: 'ManutenÃ§Ã£o elÃ©trica', tipo: 'Despesa', valor: 320, estado: 'Pendente' },
      { data: '03/07/2026', descricao: 'TransferÃªncia interna', tipo: 'TransferÃªncia', valor: 450, estado: 'Pago' },
      { data: '02/07/2026', descricao: 'Limpeza comum', tipo: 'Despesa', valor: 180, estado: 'Atrasado' },
      { data: '01/07/2026', descricao: 'Quota condomÃ­nio', tipo: 'Receita', valor: 980, estado: 'Pago' },
      { data: '30/06/2026', descricao: 'ServiÃ§os de seguranÃ§a', tipo: 'Despesa', valor: 610, estado: 'Pago' },
    ],
  });
});

app.get("/api/manutencao", (req, res) => {
  res.json({
    items: [
      { data: '05/07/2026', tipo: 'Avaria', descricao: 'PortÃ£o elÃ©trico avariado', prioridade: 'Alta', estado: 'Pendente', tecnico: 'Rui Silva' },
      { data: '04/07/2026', tipo: 'ManutenÃ§Ã£o', descricao: 'Troca de lÃ¢mpadas', prioridade: 'MÃ©dia', estado: 'Em curso', tecnico: 'Ana Costa' },
      { data: '03/07/2026', tipo: 'InspeÃ§Ã£o', descricao: 'InspeÃ§Ã£o de sistema de incÃªndios', prioridade: 'Alta', estado: 'ConcluÃ­da', tecnico: 'Pedro Mendes' },
      { data: '02/07/2026', tipo: 'Avaria', descricao: 'Vazamento na cozinha', prioridade: 'Alta', estado: 'Pendente', tecnico: 'Miguel Rocha' },
      { data: '01/07/2026', tipo: 'ManutenÃ§Ã£o', descricao: 'Limpeza de condutas', prioridade: 'Baixa', estado: 'ConcluÃ­da', tecnico: 'Sara Alves' },
    ],
  });
});

app.post("/api/conciliate", async (req, res) => {
  const { statement, fracoes, avisos } = req.body;
  if (!statement) {
    return res.status(400).json({ error: "Extrato em falta." });
  }

  try {
    const prompt = `Analise o seguinte extrato bancÃ¡rio de condomÃ­nio e faÃ§a a conciliaÃ§Ã£o de pagamentos com base nas fraÃ§Ãµes e avisos de cobranÃ§a pendentes fornecidos.
Extrato:
${statement}

FraÃ§Ãµes disponÃ­veis:
${JSON.stringify(fracoes, null, 2)}

Avisos pendentes:
${JSON.stringify(avisos, null, 2)}

Identifique os pagamentos (Receitas) no extrato. Tente associar cada pagamento de quota recebido a uma fraÃ§Ã£o especÃ­fica e aos avisos pendentes correspondentes.
Para cada pagamento detetado, retorne um objeto estruturado no seguinte formato JSON:
{
  "movimentos": [
    {
      "data": "AAAA-MM-DD",
      "valor": 12.34, // nÃºmero
      "ordenante": "Nome do condÃ³mino ordenante ou descriÃ§Ã£o no extrato",
      "descricao": "A descriÃ§Ã£o do movimento exatamente como aparece no extrato",
      "fracao_sugerida": "id_fracao_detetada_ou_nulo",
      "correspondencia_confianÃ§a": "95%", // ConfianÃ§a da correspondÃªncia
      "avisos_associados": ["id_aviso_1", "id_aviso_2"] // IDs de avisos que este pagamento liquida
    }
  ]
}

Seja preciso. Se nÃ£o conseguir identificar a fraÃ§Ã£o ou aviso com certeza, retorne a fraÃ§Ã£o_sugerida como nulo e avisos_associados vazio. Use apenas o formato JSON indicado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["movimentos"],
          properties: {
            movimentos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["data", "valor", "ordenante", "descricao", "fracao_sugerida", "correspondencia_confianÃ§a", "avisos_associados"],
                properties: {
                  data: { type: Type.STRING },
                  valor: { type: Type.NUMBER },
                  ordenante: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                  fracao_sugerida: { type: Type.STRING },
                  correspondencia_confianÃ§a: { type: Type.STRING },
                  avisos_associados: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Erro na conciliaÃ§Ã£o por IA:", error);
    res.status(500).json({ error: error.message || "Erro desconhecido durante o processamento por IA." });
  }
});

app.post("/api/generate-minutes", async (req, res) => {
  const { tema, data, hora, ordens_trabalho, notas, predio, presentes, quorum } = req.body;

  try {
    const systemInstruction = `Ã‰s um Assistente JurÃ­dico especializado em Direito do CondomÃ­nio em Portugal (CÃ³digo Civil portuguÃªs).
Gera uma ata de assembleia de condÃ³minos formal, rigorosa e profissional, redigida em portuguÃªs de Portugal (PT-PT) clÃ¡ssico e vocabulÃ¡rio jurÃ­dico preciso.

Estrutura formal esperada de uma ata:
1. CabeÃ§alho formal identificando o EdifÃ­cio, a sua morada completa, a data e a hora de inÃ­cio.
2. ReferÃªncia ao quÃ³rum constitutivo, expressando a permilagem total presente e representada (${quorum}â€°), e se a reuniÃ£o decorreu em Primeira ConvocatÃ³ria (se >= 500â€°) ou em Segunda ConvocatÃ³ria trinta minutos mais tarde (se < 500â€°), em conformidade com as regras do CÃ³digo Civil (Artigo 1432Âº).
3. Listagem formal das fraÃ§Ãµes presentes e representadas com as respetivas permilagens.
4. IdentificaÃ§Ã£o de quem presidiu Ã  mesa e quem secretariou.
5. DiscussÃ£o ponto por ponto das Ordens de Trabalho, detalhando as deliberaÃ§Ãµes e votaÃ§Ãµes com base nas notas fornecidas pelo utilizador.
6. Encerramento formal referindo que se lavrou a presente ata, que serÃ¡ assinada pelos presentes, pelo presidente e pelo administrador do condomÃ­nio.

MantÃ©m sempre datas escritas por extenso no inÃ­cio da ata (Ex: "Aos catorze dias do mÃªs de Julho do ano de dois mil e vinte e seis...").
Evita simplificar. O texto deve ser digno de registo predial e arquivo legal permanente.`;

    const prompt = `Gere o rascunho oficial da Ata de Assembleia de CondÃ³minos com os seguintes dados:

EDIFÃCIO:
- Nome/DesignaÃ§Ã£o: ${predio?.nome || "EdifÃ­cio Morada"}
- Morada: ${predio?.morada_linha1 || "Rua do CondomÃ­nio"}, NÂº ${predio?.num_porta || ""}, ${predio?.localidade || ""}

ASSEMBLEIA:
- Tema: ${tema}
- Data de Agendamento: ${data}
- Hora de InÃ­cio: ${hora}

QUÃ“RUM E PRESENÃ‡AS:
- QuÃ³rum Total Presente: ${quorum}â€° de permilagem total do edifÃ­cio.
- Lista de CondÃ³minos Presentes/Representados:
${JSON.stringify(presentes, null, 2)}

ORDENS DE TRABALHO:
${ordens_trabalho}

NOTAS E DELIBERAÃ‡Ã•ES DA REUNIÃƒO:
${notas || "Sem notas de deliberaÃ§Ã£o adicionais fornecidas."}

Gera o texto completo da ata, pronto para revisÃ£o humana e posterior assinatura.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const generatedText = response.text || "";
    res.json({ minutes: generatedText });
  } catch (error: any) {
    console.error("Erro na redaÃ§Ã£o da ata por IA:", error);
    res.status(500).json({ error: error.message || "Erro durante a geraÃ§Ã£o da ata." });
  }
});

app.post("/api/generate-legal-notice", async (req, res) => {
  const { proprietario, fracao, atraso, predio, totalDebito } = req.body;

  try {
    const systemInstruction = `Ã‰s um Consultor JurÃ­dico especializado em Contencioso de CondomÃ­nios em Portugal.
Redige uma carta formal de interpelaÃ§Ã£o e aviso de dÃ­vida de quotas de condomÃ­nio em atraso.
A redaÃ§Ã£o deve ser em portuguÃªs de Portugal (PT-PT) jurÃ­dico clÃ¡ssico, formal, assertivo e com terminologia jurÃ­dica portuguesa impecÃ¡vel.

Deves citar o Artigo 1424Âº-B do CÃ³digo Civil (responsabilidade pelas despesas de cobranÃ§a extrajudicial) e o Artigo 1424Âº do CÃ³digo Civil (obrigaÃ§Ã£o de participar nas despesas comuns).
Indica tambÃ©m que a presente carta serve para constituir o devedor em mora (Artigo 805Âº do CÃ³digo Civil) e constitui aviso prÃ©vio para efeitos de posterior aÃ§Ã£o executiva com base na ata da assembleia que serve de tÃ­tulo executivo (Artigo 6Âº do Decreto-Lei nÂº 268/94, de 25 de outubro).

A carta deve incluir:
1. CabeÃ§alho com dados do CondomÃ­nio Exequente, data de hoje por extenso.
2. IdentificaÃ§Ã£o clara da FraÃ§Ã£o e ProprietÃ¡rio.
3. DescriÃ§Ã£o dos valores em falta (${totalDebito}â‚¬) e o detalhe fornecido.
4. ConcessÃ£o de um prazo de 15 dias Ãºteis para regularizaÃ§Ã£o por transferÃªncia bancÃ¡ria ou contacto para acordo de pagamento.
5. MenÃ§Ã£o expressa a que a ausÃªncia de resposta resultarÃ¡ no recurso Ã  via judicial para cobranÃ§a coerciva (Julgados de Paz ou Tribunal Judicial), imputando-se ao condÃ³mino faltoso todos os custos processuais e honorÃ¡rios correspondentes.`;

    const prompt = `Gere a notificaÃ§Ã£o de dÃ­vida e aviso de cobranÃ§a extrajudicial com os seguintes dados:
CONDOMÃNIO: ${predio?.nome || "CondomÃ­nio do EdifÃ­cio"}
MORADA: ${predio?.morada_linha1 || ""}, NÂº ${predio?.num_porta || ""}, ${predio?.localidade || ""}
CONDÃ“MINO DEVEDOR: ${proprietario?.nome}
NIF DEVEDOR: ${proprietario?.nif || "NÃ£o registado"}
EMAIL DEVEDOR: ${proprietario?.email || ""}
FRAÃ‡ÃƒO: FraÃ§Ã£o ${fracao?.fracao_nome || ""} (${fracao?.piso || ""})
VALOR TOTAL EM DÃVIDA: ${totalDebito}â‚¬
HISTÃ“RICO DE QUOTAS EM ATRASO:
${JSON.stringify(atraso, null, 2)}

Produz uma minuta jurÃ­dica completa pronta para envio em correio registado com aviso de receÃ§Ã£o.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({ documentText: response.text || "" });
  } catch (error: any) {
    console.error("Erro na geraÃ§Ã£o de notificaÃ§Ã£o legal:", error);
    res.status(500).json({ error: error.message || "Erro na geraÃ§Ã£o do documento legal." });
  }
});

app.post("/api/predict-reserve-fund", async (req, res) => {
  const { movements, saldoAtual, orcamentoAnual, patrimonio, predioNome } = req.body;

  try {
    const systemInstruction = `Ã‰s um Analista Financeiro e Gestor de Ativos especializado na simulaÃ§Ã£o de despesas de condomÃ­nios em Portugal.
Analisa o histÃ³rico de despesas/movimentos fornecido e projeta o estado do Fundo de Reserva Comum (que por lei portuguesa - Artigo 4Âº do Decreto-Lei nÂº 268/94 - deve corresponder a pelo menos 10% do orÃ§amento ordinÃ¡rio anual e ser alimentado por contribuiÃ§Ãµes de todos os condÃ³minos) para os prÃ³ximos 12 meses.

Identifica riscos baseados no patrimÃ³nio do edifÃ­cio (por exemplo, se tem elevadores, garagem, jardins ou piscina, haverÃ¡ despesas previsÃ­veis recorrentes de manutenÃ§Ã£o, eletricidade ou inspeÃ§Ãµes periÃ³dicas legais).
Deves retornar uma resposta estruturada EXCLUSIVAMENTE em formato JSON com o seguinte schema:
{
  "projections": [
    {
      "month": "Nome do MÃªs ou NÂº do MÃªs (Ex: Julho 26)",
      "currentReserve": 1250.00,
      "predictedExpenses": 200.00,
      "predictedRevenue": 150.00,
      "finalReserve": 1200.00
    }
  ],
  "alerts": [
    {
      "level": "info" | "warning" | "danger",
      "message": "Mensagem detalhada do alerta predictivo."
    }
  ],
  "recommendations": [
    "RecomendaÃ§Ã£o prÃ¡tica e legalizada de gestÃ£o financeira."
  ]
}

NÃ£o incluas explicaÃ§Ãµes ou markdown fora do bloco JSON. Certifica-te de que o JSON Ã© vÃ¡lido.`;

    const prompt = `EDIFÃCIO: ${predioNome || "CondomÃ­nio Exemplo"}
PATRIMÃ“NIO RELEVANTE: ${JSON.stringify(patrimonio, null, 2)}
SALDO ATUAL DO FUNDO DE RESERVA: ${saldoAtual}â‚¬
ORÃ‡AMENTO ORDINÃRIO ANUAL: ${orcamentoAnual}â‚¬
HISTÃ“RICO RECENTE DE MOVIMENTOS:
${JSON.stringify(movements, null, 2)}

Faz uma anÃ¡lise de cruzamento, considerando que o fundo de reserva comum Ã© alimentado mensalmente e sofre despesas de conservaÃ§Ã£o. Desenha a projeÃ§Ã£o mensal para os prÃ³ximos 12 meses (comeÃ§ando no mÃªs de Julho de 2026), identifica riscos de descida abaixo de 10% do orÃ§amento anual (${orcamentoAnual * 0.10}â‚¬) e dÃ¡ alertas preventivos e recomendaÃ§Ãµes em portuguÃªs de Portugal (PT-PT).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Erro na simulaÃ§Ã£o predictiva do fundo de reserva:", error);
    res.status(500).json({ error: error.message || "Erro na simulaÃ§Ã£o do fundo de reserva." });
  }
});

app.post("/api/compare-proposals", async (req, res) => {
  const { requestDescription, proposals } = req.body;

  try {
    const systemInstruction = `Ã‰s um Administrador de CondomÃ­nios profissional em Portugal e perito em contrataÃ§Ã£o pÃºblica e privada de empreiteiros ou fornecedores de serviÃ§os.
Analisa e compara detalhadamente as propostas recebidas de fornecedores para o pedido de orÃ§amento descrito.

Deves construir uma matriz comparativa estruturada, identificar prÃ³s e contras objetivos e fornecer uma recomendaÃ§Ã£o fundamentada em termos de relaÃ§Ã£o custo-benefÃ­cio, garantias fornecidas, prazos propostos e conformidade legal (ex: seguros de acidentes de trabalho, alvarÃ¡ de obras pÃºblicas/privadas, etc.).

Retorna EXCLUSIVAMENTE um objeto estruturado em formato JSON com o seguinte schema:
{
  "comparisonMatrix": [
    {
      "criterion": "Nome do CritÃ©rio (Ex: PreÃ§o, Prazo, Garantia, NÃ­vel de Detalhe)",
      "supplierA": "Valor/Texto para o Fornecedor A",
      "supplierB": "Valor/Texto para o Fornecedor B",
      "supplierC": "Valor/Texto para o Fornecedor C ou N/A se nÃ£o aplicÃ¡vel",
      "winner": "Nome do Fornecedor vencedor neste critÃ©rio"
    }
  ],
  "analysis": {
    "supplierAName": {
      "pros": ["Vantagem 1"],
      "cons": ["Desvantagem 1"],
      "score": 85
    },
    "supplierBName": {
      "pros": ["Vantagem 1"],
      "cons": ["Desvantagem 1"],
      "score": 90
    }
  },
  "recommendation": "Texto de anÃ¡lise global recomendando formalmente a melhor opÃ§Ã£o com justificaÃ§Ã£o comercial e jurÃ­dica em PT-PT."
}

Substitua "supplierAName" e "supplierBName" pelos nomes reais dos fornecedores avaliados. NÃ£o introduzas markdown fora do JSON.`;

    const prompt = `PEDIDO DE ORÃ‡AMENTO DO CONDOMÃNIO:
${requestDescription}

PROPOSTAS RECEBIDAS DE FORNECEDORES:
${JSON.stringify(proposals, null, 2)}

Faz a anÃ¡lise comparativa de forma extremamente rigorosa.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Erro na comparaÃ§Ã£o de propostas:", error);
    res.status(500).json({ error: error.message || "Erro na comparaÃ§Ã£o de propostas por IA." });
  }
});

app.post("/api/parse-import", async (req, res) => {
  const { textContent } = req.body;
  if (!textContent) {
    return res.status(400).json({ error: "ConteÃºdo textual em falta para importaÃ§Ã£o." });
  }

  try {
    const systemInstruction = `Ã‰s um Assistente Inteligente especializado em migraÃ§Ã£o e importaÃ§Ã£o de dados de condomÃ­nios em Portugal.
Analisa o texto fornecido (que pode ser uma cÃ³pia de um PDF, tabela Excel, e-mail ou documento de outra gestora de condomÃ­nios) e extrai de forma estruturada:
1. Cadastro do prÃ©dio (nome, morada, nif, cÃ³digo postal, localidade, caraterÃ­sticas fÃ­sicas/patrimÃ³nio).
2. Lista de fraÃ§Ãµes com as respetivas caraterÃ­sticas (piso, permilagem, tipologia).
3. Dados do proprietÃ¡rio/condÃ³mino associado a cada fraÃ§Ã£o (nome, NIF, e-mail, telemÃ³vel/contacto).
4. Saldos de quotas em atraso ou crÃ©ditos iniciais de cada fraÃ§Ã£o.

Retorna os dados EXCLUSIVAMENTE em formato JSON estruturado respeitando o schema definido. Se faltarem informaÃ§Ãµes crÃ­ticas (como NIF, e-mail, telemÃ³vel), deixa esses campos vazios ("") no JSON, mas garante que os identificas. NÃ£o adiciones comentÃ¡rios fora do JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Extraia as informaÃ§Ãµes do seguinte documento de condomÃ­nio para importaÃ§Ã£o global:\n\n${textContent}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["predio", "fracoes"],
          properties: {
            predio: {
              type: Type.OBJECT,
              required: ["nome", "morada_linha1", "num_porta", "codigo_postal", "localidade", "nif", "patrimonio"],
              properties: {
                nome: { type: Type.STRING, description: "Nome ou designaÃ§Ã£o do condomÃ­nio" },
                morada_linha1: { type: Type.STRING, description: "Rua/Morada principal" },
                num_porta: { type: Type.STRING, description: "NÃºmero de porta ou lote" },
                codigo_postal: { type: Type.STRING, description: "CÃ³digo postal formato XXXX-XXX" },
                localidade: { type: Type.STRING, description: "Cidade ou localidade" },
                nif: { type: Type.STRING, description: "NIF do prÃ©dio (9 dÃ­gitos)" },
                patrimonio: {
                  type: Type.OBJECT,
                  required: ["tem_elevador", "tem_garagem", "tem_jardins"],
                  properties: {
                    tem_elevador: { type: Type.BOOLEAN },
                    num_elevadores: { type: Type.INTEGER },
                    tem_garagem: { type: Type.BOOLEAN },
                    tem_jardins: { type: Type.BOOLEAN },
                    tem_piscina: { type: Type.BOOLEAN }
                  }
                }
              }
            },
            fracoes: {
              type: Type.ARRAY,
              description: "Lista de fraÃ§Ãµes identificadas",
              items: {
                type: Type.OBJECT,
                required: ["fracao_nome", "piso", "permilagem", "tipologia", "proprietario", "saldo_inicial"],
                properties: {
                  fracao_nome: { type: Type.STRING, description: "Ex: A, 1Âº Esq, Loja" },
                  piso: { type: Type.STRING, description: "Ex: R/C, 1Âº, Garagem" },
                  permilagem: { type: Type.NUMBER, description: "Permilagem da fraÃ§Ã£o, ex: 50 ou 120" },
                  tipologia: { type: Type.STRING, description: "Ex: T2, T3, Loja" },
                  proprietario: {
                    type: Type.OBJECT,
                    required: ["nome", "nif", "email", "tlm"],
                    properties: {
                      nome: { type: Type.STRING, description: "Nome completo do condÃ³mino/proprietÃ¡rio" },
                      nif: { type: Type.STRING, description: "NIF do proprietÃ¡rio se houver, caso contrÃ¡rio vazio" },
                      email: { type: Type.STRING, description: "Email do proprietÃ¡rio se houver, caso contrÃ¡rio vazio" },
                      tlm: { type: Type.STRING, description: "TelemÃ³vel do proprietÃ¡rio se houver, caso contrÃ¡rio vazio" }
                    }
                  },
                  saldo_inicial: { type: Type.NUMBER, description: "Saldo ou dÃ­vida inicial da fraÃ§Ã£o. Valores negativos indicam quotas em atraso / dÃ©bito." }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Erro na importaÃ§Ã£o global por IA:", error);
    res.status(500).json({ error: error.message || "Erro no processamento da importaÃ§Ã£o." });
  }
});

app.post("/api/predict-budget", async (req, res) => {
  const { 
    predio, 
    fracoes, 
    movements, 
    avisos,
    obrasFuturas,
    contratos,
    seguros,
    servicos,
    manutencao,
    limpeza,
    inspecoes,
    inadimplenciaHistorica
  } = req.body;

  try {
    const systemInstruction = `Ã‰s um Consultor e Diretor Financeiro (CFO) de GestÃ£o de CondomÃ­nios em Portugal, especialista na elaboraÃ§Ã£o automatizada de orÃ§amentos anuais e planeamento de tesouraria de edifÃ­cios residenciais e comerciais.
Analisa todos os parÃ¢metros de entrada fornecidos (incluindo fraÃ§Ãµes, permilagem, histÃ³rico de movimentos e avisos, obras futuras e custos operacionais estimados) e calcula de forma extremamente rigorosa os dados orÃ§amentais preventivos e preditivos da IA.

Deves retornar EXCLUSIVAMENTE um objeto estruturado em formato JSON com o seguinte schema:
{
  "despesas_previstas": 12500.00, // nÃºmero
  "receitas_previstas": 13200.00, // nÃºmero
  "fundo_minimo_legal": 1250.00,  // nÃºmero (mÃ­nimo 10% das despesas previstas, obrigatÃ³rio por lei portuguesa)
  "fundo_recomendado": 2500.00,   // nÃºmero (valor recomendado para salvaguarda, geralmente entre 15% e 25% do orÃ§amento)
  "saldo_anual_previsto": 700.00, // nÃºmero (saldo lÃ­quido estimado)
  "impacto_obras": "ExplicaÃ§Ã£o em PT-PT do impacto das obras previstas nas contas do condomÃ­nio.",
  "impacto_quotas_extraordinarias": "ExplicaÃ§Ã£o em PT-PT do impacto das quotas extraordinÃ¡rias propostas no saldo e poupanÃ§a.",
  "impacto_inadimplencia_prevista": "ExplicaÃ§Ã£o em PT-PT do impacto da inadimplÃªncia histÃ³rica estimada sobre o fluxo de caixa.",
  "quota_minima": 35.50, // sugestÃ£o de quota mensal mÃ©dia mÃ­nima
  "quota_recomendada": 42.00, // sugestÃ£o de quota mensal recomendada
  "quota_ideal": 50.00, // sugestÃ£o de quota mensal ideal
  "quota_extraordinaria": 15.00, // sugestÃ£o de quota extraordinÃ¡ria mensal mÃ©dia se necessÃ¡rio
  "explicacao_quotas": "ExplicaÃ§Ã£o detalhada e fundamentada para a sugestÃ£o de cada nÃ­vel de quota mensal.",
  "quota_extraordinaria_sugestao": {
    "valor_total": 5000.00, // valor total sugerido para a quota extraordinÃ¡ria
    "valor_por_fracao_medio": 450.00, // valor mÃ©dio por fraÃ§Ã£o
    "fracionamentos": [
      { "meses": 3, "valor_mensal_medio": 150.00 },
      { "meses": 6, "valor_mensal_medio": 75.00 },
      { "meses": 9, "valor_mensal_medio": 50.00 },
      { "meses": 12, "valor_mensal_medio": 37.50 },
      { "meses": 18, "valor_mensal_medio": 25.00 },
      { "meses": 24, "valor_mensal_medio": 18.75 }
    ],
    "referencia": "BR23E", // ReferÃªncia obrigatÃ³ria
    "impacto_fundo": "AnÃ¡lise do impacto que a receita desta quota extraordinÃ¡ria terÃ¡ no Fundo de Reserva Comum.",
    "impacto_saldo": "AnÃ¡lise do impacto no saldo de tesouraria geral anual."
  },
  "chart_data": [
    {
      "month": "Jul 26",
      "saldo_futuro": 3150.00,
      "despesas_futuras": 850.00,
      "receitas_previstas": 1100.00,
      "obras_futuras": 0.00,
      "inadimplencia_prevista": 150.00
    }
    // Fornecer exatamente 12 meses de projeÃ§Ã£o comeÃ§ando em Julho de 2026 atÃ© Junho de 2027.
  ]
}

NÃ£o incluas markdown ou texto explicativo fora do JSON.`;

    const prompt = `EDIFÃCIO:
- Nome: ${predio?.nome || "EdifÃ­cio Morada"}
- Morada: ${predio?.morada_linha1 || ""}, NÂº ${predio?.num_porta || ""}, ${predio?.localidade || ""}
- NIF: ${predio?.nif || ""}
- PatrimÃ³nio: ${JSON.stringify(predio?.patrimonio, null, 2)}

DADOS DAS FRAÃ‡Ã•ES E PERMILAGEM:
${JSON.stringify(fracoes?.map((f: any) => ({ id: f.id_fracao, nome: f.fracao_nome, permilagem: f.permilagem, proprietario: f.proprietario?.nome })), null, 2)}

HISTÃ“RICO OPERACIONAL (CUSTOS ATUAIS ESTIMADOS):
- Contratos Mensais Ativos: â‚¬${contratos || 250}/mÃªs
- Seguros Anuais do EdifÃ­cio: â‚¬${seguros || 800}/ano
- ServiÃ§os Operacionais (AdministraÃ§Ã£o/Apoio): â‚¬${servicos || 150}/mÃªs
- ManutenÃ§Ã£o PeriÃ³dica Preventiva: â‚¬${manutencao || 120}/mÃªs
- Limpeza Geral das Ãreas Comuns: â‚¬${limpeza || 180}/mÃªs
- InspeÃ§Ãµes ObrigatÃ³rias e Elevadores: â‚¬${inspecoes || 450}/ano

PLANEAMENTO DE OBRAS FUTURAS:
${JSON.stringify(obrasFuturas || [], null, 2)}

INADIMPLÃŠNCIA E HISTÃ“RICO FINANCEIRO:
- Taxa de InadimplÃªncia HistÃ³rica Estimada: ${inadimplenciaHistorica || 12}%
- Lista recente de Movimentos (para fins de histÃ³rico de receitas/despesas):
${JSON.stringify(movements?.slice(0, 20), null, 2)}
- Lista de Avisos (para apurar inadimplÃªncia atual):
${JSON.stringify(avisos?.slice(0, 20), null, 2)}

Calcula e projeta o orÃ§amento anual ideal automÃ¡tico para este edifÃ­cio. DÃ¡ sugestÃµes automÃ¡ticas de quota mensal (mÃ­nima, recomendada, ideal, extraordinÃ¡ria) e uma sugestÃ£o automatizada de quotas extraordinÃ¡rias com fracionamento obrigatÃ³rio em 3, 6, 9, 12, 18, 24 meses sob a referÃªncia BR23E. Por fim, desenha 12 meses de projeÃ§Ãµes financeiras completas para compor o painel grÃ¡fico.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "despesas_previstas",
            "receitas_previstas",
            "fundo_minimo_legal",
            "fundo_recomentado", // wait, let's use fundo_recomendado in schema but be careful with typo
            "saldo_anual_previsto",
            "impacto_obras",
            "impacto_quotas_extraordinarias",
            "impacto_inadimplencia_prevista",
            "quota_minima",
            "quota_recomendada",
            "quota_ideal",
            "quota_extraordinaria",
            "explicacao_quotas",
            "quota_extraordinaria_sugestao",
            "chart_data"
          ],
          properties: {
            despesas_previstas: { type: Type.NUMBER },
            receitas_previstas: { type: Type.NUMBER },
            fundo_minimo_legal: { type: Type.NUMBER },
            fundo_recomentado: { type: Type.NUMBER, description: "Fundo recomendado" },
            saldo_anual_previsto: { type: Type.NUMBER },
            impacto_obras: { type: Type.STRING },
            impacto_quotas_extraordinarias: { type: Type.STRING },
            impacto_inadimplencia_prevista: { type: Type.STRING },
            quota_minima: { type: Type.NUMBER },
            quota_recomendada: { type: Type.NUMBER },
            quota_ideal: { type: Type.NUMBER },
            quota_extraordinaria: { type: Type.NUMBER },
            explicacao_quotas: { type: Type.STRING },
            quota_extraordinaria_sugestao: {
              type: Type.OBJECT,
              required: [
                "valor_total",
                "valor_por_fracao_medio",
                "fracionamentos",
                "referencia",
                "impacto_fundo",
                "impacto_saldo"
              ],
              properties: {
                valor_total: { type: Type.NUMBER },
                valor_por_fracao_medio: { type: Type.NUMBER },
                fracionamentos: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["meses", "valor_mensal_medio"],
                    properties: {
                      meses: { type: Type.INTEGER },
                      valor_mensal_medio: { type: Type.NUMBER }
                    }
                  }
                },
                referencia: { type: Type.STRING },
                impacto_fundo: { type: Type.STRING },
                impacto_saldo: { type: Type.STRING }
              }
            },
            chart_data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: [
                  "month",
                  "saldo_futuro",
                  "despesas_futuras",
                  "receitas_previstas",
                  "obras_futuras",
                  "inadimplencia_prevista"
                ],
                properties: {
                  month: { type: Type.STRING },
                  saldo_futuro: { type: Type.NUMBER },
                  despesas_futuras: { type: Type.NUMBER },
                  receitas_previstas: { type: Type.NUMBER },
                  obras_futuras: { type: Type.NUMBER },
                  inadimplencia_prevista: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    // Align typos if schema was forced to a specific field
    if (data.fundo_recomentado && !data.fundo_recomendado) {
      data.fundo_recomendado = data.fundo_recomentado;
    }
    res.json(data);
  } catch (error: any) {
    console.error("Erro na simulaÃ§Ã£o orÃ§amental automÃ¡tica:", error);
    res.status(500).json({ error: error.message || "Erro no processamento orÃ§amental por IA." });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();








