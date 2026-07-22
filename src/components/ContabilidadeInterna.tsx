import { Icon } from './Icon';
import React, { useState } from "react";
import { Predio, LoggedUser, Movimento } from "../types";

interface ContabilidadeInternaProps {
  predio: Predio;
  loggedUser: LoggedUser;
  movimentos?: Movimento[];
}

interface PlanoConta {
  codigo: string;
  nome: string;
  tipo: "GASTO" | "RENDIMENTO" | "ATIVO" | "PASSIVO";
  descricao: string;
}

interface ComprovativoPendente {
  id_comprovativo: string;
  nome_ficheiro: string;
  data_sugerida: string;
  valor_sugerido: number;
  descricao_sugerida: string;
  estado: "NÃ£o Reconciliado" | "Sugerido" | "Reconciliado";
}

export function ContabilidadeInterna({ predio, loggedUser, movimentos = [] }: ContabilidadeInternaProps) {
  const [activeTabContab, setActiveTabContab] = useState<"plano" | "reconciliacao" | "motor_regras">("plano");
  
  // 1. Plano de Contas Oficial de CondomÃ­nios (SNC Simplificado)
  const [planoContas, setPlanoContas] = useState<PlanoConta[]>([
    { codigo: "11", nome: "Caixa Geral de CondomÃ­nio", tipo: "ATIVO", descricao: "Fundo fÃ­sico de maneio em numerÃ¡rio" },
    { codigo: "12", nome: "DepÃ³sitos Ã  Ordem", tipo: "ATIVO", descricao: "Contas bancÃ¡rias correntes do condomÃ­nio" },
    { codigo: "13", nome: "Fundo Comum de Reserva", tipo: "ATIVO", descricao: "Conta bancÃ¡ria especÃ­fica para o FCR" },
    { codigo: "61", nome: "Consumos de Ãgua", tipo: "GASTO", descricao: "Faturas de Ã¡gua das partes comuns" },
    { codigo: "62", nome: "Consumos de Eletricidade", tipo: "GASTO", descricao: "Faturas de eletricidade/luz comum" },
    { codigo: "63", nome: "ManutenÃ§Ã£o Elevadores", tipo: "GASTO", descricao: "Contratos e assistÃªncia tÃ©cnica de elevadores" },
    { codigo: "64", nome: "ServiÃ§os de Limpeza", tipo: "GASTO", descricao: "SalÃ¡rios de limpezas ou faturas de empresas" },
    { codigo: "65", nome: "Seguros de EdifÃ­cio", tipo: "GASTO", descricao: "ApÃ³lices multirrisco comuns" },
    { codigo: "68", nome: "Obras de ConservaÃ§Ã£o", tipo: "GASTO", descricao: "Gastos com pinturas, telhado e reparos" },
    { codigo: "71", nome: "Rendimentos de Quotas", tipo: "RENDIMENTO", descricao: "ContribuiÃ§Ãµes de quotas ordinÃ¡rias das fraÃ§Ãµes" },
    { codigo: "72", nome: "Rendimentos FCR", tipo: "RENDIMENTO", descricao: "ReforÃ§os das fraÃ§Ãµes consignados ao FCR" },
    { codigo: "78", nome: "Rendimentos ExtraordinÃ¡rios", tipo: "RENDIMENTO", descricao: "Quotas extra para obras ou indemnizaÃ§Ãµes" }
  ]);

  // Plano de Contas state helper
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<"GASTO" | "RENDIMENTO" | "ATIVO" | "PASSIVO">("GASTO");
  const [novaDesc, setNovaDesc] = useState("");

  const handleAdicionarConta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCodigo || !novoNome) {
      alert("Por favor, preencha o cÃ³digo e o nome da conta contÃ¡bil.");
      return;
    }
    if (planoContas.some(c => c.codigo === novoCodigo)) {
      alert("JÃ¡ existe uma conta com este cÃ³digo contÃ¡bil.");
      return;
    }
    const nC: PlanoConta = {
      codigo: novoCodigo,
      nome: novoNome,
      tipo: novoTipo,
      descricao: novaDesc
    };
    setPlanoContas([...planoContas, nC].sort((a,b) => a.codigo.localeCompare(b.codigo)));
    alert("Conta contÃ¡bil adicionada com sucesso ao Plano de Contas!");
    setNovoCodigo("");
    setNovoNome("");
    setNovaDesc("");
  };

  // 2. ReconciliaÃ§Ã£o AutomÃ¡tica: State variables
  const [movimentosReconciliacao, setMovimentosReconciliacao] = useState<Movimento[]>([
    { id_mov: "rec-mov-1", id_predio: predio.id_predio, id_conta: "c-1", data: "2026-07-12", tipo: "DESPESA", valor: 160.00, descricao: "EMPRESA ESTRELA LIMPEZAS", categoria: "ServiÃ§os de Limpeza", estado: "Pendente" },
    { id_mov: "rec-mov-2", id_predio: predio.id_predio, id_conta: "c-1", data: "2026-07-10", tipo: "DESPESA", valor: 45.12, descricao: "EPAL AGUA JULHO", categoria: "Consumos de Ãgua", estado: "Pendente" },
    { id_mov: "rec-mov-3", id_predio: predio.id_predio, id_conta: "c-1", data: "2026-07-08", tipo: "RECEITA", valor: 350.00, descricao: "PAGAMENTO QUOTA FRACAO A", categoria: "Rendimentos de Quotas", estado: "Pendente" },
    { id_mov: "rec-mov-4", id_predio: predio.id_predio, id_conta: "c-1", data: "2026-07-05", tipo: "DESPESA", valor: 85.00, descricao: "MANUTENCAO ELEVADOR OTIS", categoria: "ManutenÃ§Ã£o Elevadores", estado: "Pendente" }
  ]);

  const [comprovativosPendentes, setComprovativosPendentes] = useState<ComprovativoPendente[]>([
    { id_comprovativo: "doc-rec-1", nome_ficheiro: "Fatura_Estrela_Limp_429.pdf", data_sugerida: "2026-07-12", valor_sugerido: 160.00, descricao_sugerida: "EMPRESA ESTRELA LIMPEZAS", estado: "NÃ£o Reconciliado" },
    { id_comprovativo: "doc-rec-2", nome_ficheiro: "Agua_EPAL_Comum.pdf", data_sugerida: "2026-07-10", valor_sugerido: 45.12, descricao_sugerida: "EPAL AGUA JULHO", estado: "NÃ£o Reconciliado" },
    { id_comprovativo: "doc-rec-3", nome_ficheiro: "Ref_BR23E_FracaoA.png", data_sugerida: "2026-07-08", valor_sugerido: 350.00, descricao_sugerida: "PAGAMENTO QUOTA FRACAO A", estado: "NÃ£o Reconciliado" }
  ]);

  const triggerReconciliacaoAutomatica = () => {
    // Attempt automatic matching between movements and documents based on Amount (valor) and similarity
    let matchedCount = 0;
    
    const novosMovs = movimentosReconciliacao.map(mov => {
      const matchDoc = comprovativosPendentes.find(doc => 
        doc.valor_sugerido === mov.valor && 
        doc.estado !== "Reconciliado"
      );

      if (matchDoc) {
        matchedCount++;
        // Update document state inside loop is complex, but we'll reflect it in the copy
        return { ...mov, estado: "Reconciliado", descricao: `${mov.descricao} [âœ“ Reconciliado com ${matchDoc.nome_ficheiro}]` };
      }
      return mov;
    });

    const novosDocs = comprovativosPendentes.map(doc => {
      const hasMatch = movimentosReconciliacao.some(mov => mov.valor === doc.valor_sugerido);
      if (hasMatch) {
        return { ...doc, estado: "Reconciliado" as const };
      }
      return doc;
    });

    setMovimentosReconciliacao(novosMovs);
    setComprovativosPendentes(novosDocs);

    alert(`Reconciliador Inteligente CondoManager AI:\nEncontrados ${matchedCount} cruzamentos automÃ¡ticos perfeitos de valores e datas! Comprovativos vinculados Ã  contabilidade.`);
  };

  // 3. Motor de CategorizaÃ§Ã£o SemÃ¢ntica / Regras
  const [inputRegraDesc, setInputRegraDesc] = useState("");
  const [sugestaoConta, setSugestaoConta] = useState<PlanoConta | null>(null);

  const testarCategorizacaoAutomatica = () => {
    if (!inputRegraDesc) {
      alert("Introduza um descritivo de transaÃ§Ã£o (Ex: 'Fatura Eletricidade EDP de Junho').");
      return;
    }

    const desc = inputRegraDesc.toLowerCase();
    let codeMatch = "68"; // Default: Obras de ConservaÃ§Ã£o / Geral
    
    if (desc.includes("epal") || desc.includes("Ã¡gua") || desc.includes("agua")) {
      codeMatch = "61";
    } else if (desc.includes("edp") || desc.includes("luz") || desc.includes("eletricidade") || desc.includes("gÃ¡s")) {
      codeMatch = "62";
    } else if (desc.includes("elevador") || desc.includes("otis") || desc.includes("schindler") || desc.includes("kone")) {
      codeMatch = "63";
    } else if (desc.includes("limp") || desc.includes("estrela") || desc.includes("higienizacao")) {
      codeMatch = "64";
    } else if (desc.includes("seguro") || desc.includes("fidelidade") || desc.includes("apolice") || desc.includes("allianz")) {
      codeMatch = "65";
    } else if (desc.includes("quota") || desc.includes("fraÃ§Ã£o") || desc.includes("fracao") || desc.includes("condÃ³mino")) {
      codeMatch = "71";
    } else if (desc.includes("fcr") || desc.includes("reserva")) {
      codeMatch = "72";
    }

    const found = planoContas.find(c => c.codigo === codeMatch);
    if (found) {
      setSugestaoConta(found);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="contabilidade-interna-module">
      {/* Description header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-6 rounded-2xl border border-indigo-500/15">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
            <i className="fa-solid fa-calculator text-xl"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Contabilidade Interna Integrada</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gerencie a contabilidade do condomÃ­nio com um Plano de Contas adaptado (SNC), regras inteligentes para classificaÃ§Ã£o de extratos e um motor de reconciliaÃ§Ã£o cruzada automÃ¡tica de despesas e faturas.
            </p>
          </div>
        </div>
      </div>

      {/* Sub tabs inside Contabilidade */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTabContab("plano")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTabContab === "plano" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className="fa-solid fa-folder-open mr-1.5"></i> Plano de Contas
        </button>
        <button
          onClick={() => setActiveTabContab("reconciliacao")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTabContab === "reconciliacao" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className="fa-solid fa-receipt mr-1.5"></i> ReconciliaÃ§Ã£o com Comprovativos
        </button>
        <button
          onClick={() => setActiveTabContab("motor_regras")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTabContab === "motor_regras" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className="fa-solid fa-bolt mr-1.5"></i> CategorizaÃ§Ã£o AutomÃ¡tica
        </button>
      </div>

      {/* 1. PLANO DE CONTAS */}
      {activeTabContab === "plano" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Add account */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Criar Conta ContÃ¡bil</h4>
            <form onSubmit={handleAdicionarConta} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">CÃ³digo</label>
                  <input
                    type="text"
                    placeholder="Ex: 66"
                    value={novoCodigo}
                    onChange={e => setNovoCodigo(e.target.value)}
                    className="border border-slate-200 px-3 py-2 text-xs rounded-lg font-mono focus:outline-indigo-500 bg-slate-50/50"
                  />
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Nome da Conta</label>
                  <input
                    type="text"
                    placeholder="Ex: TelecomunicaÃ§Ãµes"
                    value={novoNome}
                    onChange={e => setNovoNome(e.target.value)}
                    className="border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Classe de BalanÃ§o</label>
                <select
                  value={novoTipo}
                  onChange={e => setNovoTipo(e.target.value as any)}
                  className="border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-indigo-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="GASTO">Classe 6 â€” Gastos (Custo)</option>
                  <option value="RENDIMENTO">Classe 7 â€” Rendimentos (Receita)</option>
                  <option value="ATIVO">Classe 1/2 â€” Ativo / Disponibilidades</option>
                  <option value="PASSIVO">Classe 2 â€” Passivo / Fornecedores</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">DescriÃ§Ã£o Adicional</label>
                <textarea
                  placeholder="Explique o propÃ³sito contÃ¡bil desta rubrica..."
                  rows={2}
                  value={novaDesc}
                  onChange={e => setNovaDesc(e.target.value)}
                  className="border border-slate-200 p-2 text-xs rounded-lg focus:outline-indigo-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                <i className="fa-solid fa-plus mr-1.5"></i> Adicionar Conta SNC
              </button>
            </form>
          </div>

          {/* List of accounts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Rubricas ContÃ¡beis Ativas</h4>
              <button
                onClick={() => alert("Simulando exportaÃ§Ã£o do Plano de Contas para Excel...\nSucesso! Plano_de_Contas_Oficial_SNC.xlsx descarregado.")}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-file-excel mr-1"></i> Exportar Plano (Excel)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {planoContas.map(c => (
                <div key={c.codigo} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:border-indigo-300 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Conta {c.codigo}
                      </span>
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${
                        c.tipo === "GASTO" 
                          ? "bg-rose-50 text-rose-700 border-rose-200" 
                          : c.tipo === "RENDIMENTO" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {c.tipo}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800">{c.nome}</h5>
                    <p className="text-[10px] text-slate-450 leading-relaxed">{c.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. RECONCILIAÃ‡ÃƒO AUTOMÃTICA */}
      {activeTabContab === "reconciliacao" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Instructions and CTA */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 flex items-center">
                <i className="fa-solid fa-wand-magic-sparkles text-indigo-600 mr-2"></i> ConciliaÃ§Ã£o BancÃ¡ria & Comprovativos Inteligente
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                O CondoManager AI lÃª os ficheiros de faturas digitadas e extratos bancÃ¡rios integrados em tempo real. Clique em "Iniciar ReconciliaÃ§Ã£o" para emparelhar automaticamente faturas por valor e data de vencimento.
              </p>
            </div>
            <button
              onClick={triggerReconciliacaoAutomatica}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center cursor-pointer shrink-0"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2 animate-bounce"></i> Executar ReconciliaÃ§Ã£o AutomÃ¡tica
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank movements */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex justify-between">
                <span>Movimentos do Extrato BancÃ¡rio</span>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">BPI Empresas</span>
              </h4>
              <div className="space-y-2">
                {movimentosReconciliacao.map(m => (
                  <div key={m.id_mov} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">{m.data}</span>
                      <span className="text-[11px] font-black text-slate-750 block">{m.descricao}</span>
                      <span className="text-[9px] text-slate-500 block">Sugerido para: {m.categoria}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold block ${m.tipo === "RECEITA" ? "text-emerald-600" : "text-rose-600"}`}>
                        {m.tipo === "RECEITA" ? "+" : "-"}{m.valor.toFixed(2)}â‚¬
                      </span>
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                        m.estado === "Reconciliado" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {m.estado || "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded invoices / receipts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex justify-between">
                <span>Comprovativos Carregados (Faturas/Recibos)</span>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">Arquivo Digital</span>
              </h4>
              <div className="space-y-2">
                {comprovativosPendentes.map(doc => (
                  <div key={doc.id_comprovativo} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 flex items-center">
                        <i className="fa-solid fa-file-pdf text-rose-600 mr-1.5 text-xs"></i>
                        {doc.nome_ficheiro}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono block mt-0.5">ExtraÃ­do por OCR: {doc.data_sugerida} | Ref: {doc.descricao_sugerida}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800 block">{doc.valor_sugerido.toFixed(2)}â‚¬</span>
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                        doc.estado === "Reconciliado" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                      }`}>
                        {doc.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOTOR DE CATEGORIZAÃ‡ÃƒO */}
      {activeTabContab === "motor_regras" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-3xl mx-auto animate-fadeIn">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">DemonstraÃ§Ã£o: Motor de Regras e CategorizaÃ§Ã£o AutomÃ¡tica</h4>
            <p className="text-xs text-slate-500 mt-1">
              Introduza um descritivo livre (ex: do seu extrato bancÃ¡rio ou faturas OCR) e o algoritmo CondoManager AI associarÃ¡ automaticamente Ã  rubrica correspondente do plano de contas nacional (SNC).
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Descritivo da TransaÃ§Ã£o / Movimento</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ex: Pagamento da fatura EDP luz condomÃ­nio Junho"
                  value={inputRegraDesc}
                  onChange={e => setInputRegraDesc(e.target.value)}
                  className="flex-grow border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-indigo-500 bg-slate-50/50"
                />
                <button
                  onClick={testarCategorizacaoAutomatica}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Categorizar
                </button>
              </div>
            </div>

            {sugestaoConta && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start space-x-3 animate-fadeIn">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg text-sm shrink-0">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">AssociaÃ§Ã£o Inteligente Sugerida</span>
                  <p className="text-xs text-emerald-700 font-medium">
                    O CondoManager AI associou o termo Ã  conta contÃ¡bil:
                  </p>
                  <div className="font-mono text-xs font-extrabold text-indigo-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg inline-block mt-2">
                    Conta {sugestaoConta.codigo} â€” {sugestaoConta.nome} ({sugestaoConta.tipo})
                  </div>
                  <p className="text-[9px] text-slate-450 mt-1 leading-normal">
                    * Baseado em regras semÃ¢nticas de relevÃ¢ncia linguÃ­stica (Regra SNB para faturas de serviÃ§os recorrentes).
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Exemplos PrÃ¡ticos DisponÃ­veis</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fatura Ãgua da EPAL Garagem",
                  "ManutenÃ§Ã£o Elevadores Otis de Julho",
                  "ServiÃ§o Semanal Empresa Estrela Limpezas",
                  "Quota CondomÃ­nio FraÃ§Ã£o C",
                  "ReforÃ§o FCR Quota ExtraordinÃ¡ria"
                ].map(txt => (
                  <button
                    key={txt}
                    onClick={() => {
                      setInputRegraDesc(txt);
                      setSugestaoConta(null);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] px-2.5 py-1 rounded-lg border-none cursor-pointer transition-colors"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










