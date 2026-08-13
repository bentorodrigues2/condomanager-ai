import React, { useState } from "react";
import { Predio, Fracao, Movimento, Aviso } from "../types";
import { generateDynamicReportPDF, exportToXLS } from "../utils";

export interface FiltroRelatoriosPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  predio: Predio;
  fracoes: Fracao[];
  movimentos?: Movimento[];
  avisos?: Aviso[];
  initialScope?: "PREDIO" | "FRACAO" | "TODAS";
  initialFracaoId?: string;
  initialReportType?: string;
}

export function FiltroRelatoriosPDFModal({
  isOpen,
  onClose,
  predio,
  fracoes,
  movimentos = [],
  avisos = [],
  initialScope = "PREDIO",
  initialFracaoId = "",
  initialReportType = "extrato_quotas"
}: FiltroRelatoriosPDFModalProps) {
  const [ambito, setAmbito] = useState<"PREDIO" | "FRACAO" | "TODAS">(initialScope);
  const [selectedFracaoId, setSelectedFracaoId] = useState<string>(
    initialFracaoId || (fracoes.length > 0 ? fracoes[0].id_fracao : "")
  );
  const [tipoRelatorio, setTipoRelatorio] = useState<string>(initialReportType);
  const [exercicio, setExercicio] = useState<string>("Ano 2026");
  const [ordenacao, setOrdenacao] = useState<string>("letra");
  const [incluirInquilinos, setIncluirInquilinos] = useState<boolean>(true);
  const [incluirIbans, setIncluirIbans] = useState<boolean>(true);
  const [incluirAssinatura, setIncluirAssinatura] = useState<boolean>(true);

  React.useEffect(() => {
    if (initialScope) setAmbito(initialScope);
    if (initialFracaoId) setSelectedFracaoId(initialFracaoId);
    if (initialReportType) setTipoRelatorio(initialReportType);
  }, [initialScope, initialFracaoId, initialReportType]);

  if (!isOpen) return null;

  const predioFracoes = fracoes.filter(f => f.id_predio === predio.id_predio);
  const fracaoSelecionada = predioFracoes.find(f => f.id_fracao === selectedFracaoId) || predioFracoes[0];

  const handleGeneratePDF = () => {
    generateDynamicReportPDF({
      predio,
      ambito,
      fracaoId: selectedFracaoId,
      tipoRelatorio: tipoRelatorio as any,
      exercicio,
      fracoesList: predioFracoes,
      movimentosList: movimentos,
      avisosList: avisos,
      incluirInquilinos,
      incluirIbans,
      incluirAssinatura
    });
  };

  const handleExportXLS = () => {
    const filename = `Relatorio_${tipoRelatorio}_${ambito}_${predio.nome.replace(/\s+/g, "_")}`;
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tipoRelatorio === "extrato_quotas") {
      headers = ["Fração", "Piso", "Proprietário", "NIF", "Contacto", "Quota Mensal", "Estado Pagamento", "Saldo Dívida"];
      const scopeFracoes = ambito === "FRACAO" && fracaoSelecionada ? [fracaoSelecionada] : predioFracoes;
      rows = scopeFracoes.map(f => {
        const debt = avisos.filter(a => a.id_fracao === f.id_fracao && a.estado === "Pendente").reduce((acc, c) => acc + c.valor, 0);
        return [
          f.fracao_nome,
          f.piso,
          f.proprietario.nome,
          f.proprietario.nif,
          f.proprietario.tlm || f.proprietario.email,
          `${(((predio as any).orcamento_anual || 12000) * (f.permilagem / 1000) / 12).toFixed(2)}€`,
          debt > 0 ? "Em Atraso" : "Regularizado",
          `${debt.toFixed(2)}€`
        ];
      });
    } else if (tipoRelatorio === "balancete") {
      headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor (€)", "Fração Associada"];
      rows = movimentos.map(m => [
        m.data,
        m.tipo,
        m.categoria,
        m.descricao,
        m.valor.toFixed(2),
        m.id_fracao ? (predioFracoes.find(f => f.id_fracao === m.id_fracao)?.fracao_nome || "Geral") : "Geral Prédio"
      ]);
    } else if (tipoRelatorio === "fichas_condominos") {
      headers = ["Fração", "Piso", "Permilagem", "Proprietário", "NIF", "Email", "Telemóvel", "IBAN", "Arrendada?", "Inquilino"];
      const scopeFracoes = ambito === "FRACAO" && fracaoSelecionada ? [fracaoSelecionada] : predioFracoes;
      rows = scopeFracoes.map(f => [
        f.fracao_nome,
        f.piso,
        `${f.permilagem}‰`,
        f.proprietario.nome,
        f.proprietario.nif,
        f.proprietario.email,
        f.proprietario.tlm,
        f.proprietario.iban || "—",
        f.is_arrendada ? "SIM" : "NÃO",
        f.inquilino ? `${f.inquilino.nome} (${f.inquilino.tlm})` : "—"
      ]);
    } else {
      headers = ["Fração", "Piso", "Permilagem", "Responsável", "Estado", "Valor / Detalhe"];
      const scopeFracoes = ambito === "FRACAO" && fracaoSelecionada ? [fracaoSelecionada] : predioFracoes;
      rows = scopeFracoes.map(f => [
        f.fracao_nome,
        f.piso,
        `${f.permilagem}‰`,
        f.proprietario.nome,
        "Ativo",
        `Exercício ${exercicio}`
      ]);
    }

    exportToXLS(filename, headers, rows);
  };

  const handlePrintHTML = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    const titleMap: Record<string, string> = {
      extrato_quotas: "Relatório - Extrato de Quotas & Pagamentos",
      balancete: "Relatório - Balancete Financeiro Consolidado",
      fichas_condominos: "Relatório - Fichas & Dados de Cadastro de Condóminos",
      debitos_incumprimento: "Relatório - Mapa de Incumprimento & Quotas em Atraso",
      obras_manutencao: "Relatório - Intervenções Técnicas & Vistorias",
      resumo_executivo: "Relatório Executivo Geral do Edifício"
    };

    const targetTitle = titleMap[tipoRelatorio] || "Relatório Oficial do Condomínio";
    const scopeLabel = ambito === "PREDIO" ? `Edifício ${predio.nome} (Consolidado)` : ambito === "FRACAO" ? `Fração ${fracaoSelecionada?.fracao_nome || "A"}` : `Todas as Frações (${predioFracoes.length} Unidades)`;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${targetTitle} - ${predio.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 25px; font-size: 11px; color: #0f172a; }
            .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 10px; margin-bottom: 15px; }
            .header h1 { font-size: 16px; margin: 0; color: #047857; text-transform: uppercase; }
            .header p { margin: 4px 0 0 0; font-size: 10px; color: #64748b; }
            .filter-banner { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
            th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-weight: bold; color: #334155; }
            td { border: 1px solid #e2e8f0; padding: 7px; color: #0f172a; }
            tr:nth-child(even) { background: #f8fafc; }
            .total-row { background: #ecfdf5 !important; font-weight: bold; }
            .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; pt: 10px; font-size: 9px; color: #64748b; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${targetTitle}</h1>
            <p><strong>Edifício:</strong> ${predio.nome} &nbsp;|&nbsp; <strong>Morada:</strong> ${predio.morada_linha1}</p>
          </div>

          <div class="filter-banner">
            <div><strong>Âmbito Escolhido:</strong> ${scopeLabel}</div>
            <div><strong>Exercício:</strong> ${exercicio}</div>
            <div><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString("pt-PT")}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fração / Unidade</th>
                <th>Piso</th>
                <th>Permilagem</th>
                <th>Proprietário / Titular</th>
                <th>NIF Fiscal</th>
                <th>Contacto</th>
                <th>Situação / Valor</th>
              </tr>
            </thead>
            <tbody>
              ${(ambito === "FRACAO" && fracaoSelecionada ? [fracaoSelecionada] : predioFracoes).map(f => {
                const quotaM = (((predio as any).orcamento_anual || 12000) * (f.permilagem / 1000) / 12).toFixed(2);
                const debt = avisos.filter(a => a.id_fracao === f.id_fracao && a.estado === "Pendente").reduce((acc, c) => acc + c.valor, 0);
                return `
                  <tr>
                    <td><strong>Fração ${f.fracao_nome}</strong></td>
                    <td>Piso ${f.piso}</td>
                    <td>${f.permilagem}‰</td>
                    <td>${f.proprietario.nome}</td>
                    <td>${f.proprietario.nif}</td>
                    <td>${f.proprietario.tlm || f.proprietario.email}</td>
                    <td>${debt > 0 ? `<span style="color: #dc2626; font-weight: bold;">Em atraso (${debt.toFixed(2)}€)</span>` : `<span style="color: #059669; font-weight: bold;">Regularizado (${quotaM}€/mês)</span>`}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>

          <div class="footer">
            Documento gerado oficialmente pela plataforma CondoManager AI para o edifício ${predio.nome} em ${new Date().toLocaleString("pt-PT")}.
          </div>
        </body>
      </html>
    `);

    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full my-auto flex flex-col max-h-[92vh] animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <img src="/marca/18-pdf.png" alt="PDF" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Filtro Dinâmico & Exportador de Relatórios PDF / XLS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Filtre por Prédio, por Fração ou Todas as Frações e escolha o tipo de relatório a gerar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">

          {/* 1. SELEÇÃO DE ÂMBITO DO FILTRO */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              1. Selecionar Âmbito de Exportação (Filtro de Escopo) *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAmbito("PREDIO")}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  ambito === "PREDIO"
                    ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <i className="fa-solid fa-building text-emerald-600"></i>
                  <span>Por Prédio (Consolidado)</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Relatório geral de todo o edifício {predio.nome}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAmbito("FRACAO")}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  ambito === "FRACAO"
                    ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <i className="fa-solid fa-house-user text-emerald-600"></i>
                  <span>Por Fração Específica</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Relatório individual para uma única fração do prédio
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAmbito("TODAS")}
                className={`p-3.5 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  ambito === "TODAS"
                    ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <i className="fa-solid fa-list-check text-emerald-600"></i>
                  <span>Todas as Frações</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Comparativo discriminado de todas as {predioFracoes.length} frações
                </span>
              </button>
            </div>

            {/* Selector de fração caso âmbito seja "FRACAO" */}
            {ambito === "FRACAO" && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <i className="fa-solid fa-hand-pointer"></i>
                  <span>Escolha a Fração a Exportar:</span>
                </span>
                <select
                  value={selectedFracaoId}
                  onChange={e => setSelectedFracaoId(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {predioFracoes.map(f => (
                    <option key={f.id_fracao} value={f.id_fracao}>
                      Fração "{f.fracao_nome}" ({f.piso}) — {f.proprietario.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. SELEÇÃO DO TIPO DE RELATÓRIO A GERAR */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              2. Escolher o Tipo de Relatório Dinâmico *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: "extrato_quotas",
                  icon: "fa-file-invoice-dollar",
                  label: "Extrato de Quotas & Pagamentos",
                  desc: "Histórico de liquidações, quotas mensais, recibos e saldos por fração"
                },
                {
                  id: "balancete",
                  icon: "fa-scale-balanced",
                  label: "Balancete Financeiro Consolidado",
                  desc: "Demonstrativo de Receitas vs Despesas, Fundo de Reserva e Saldos"
                },
                {
                  id: "fichas_condominos",
                  icon: "fa-address-card",
                  label: "Fichas & Dados de Cadastro",
                  desc: "Contactos de Proprietários, NIFs, IBANs, Inquilinos e Moradas"
                },
                {
                  id: "debitos_incumprimento",
                  icon: "fa-triangle-exclamation",
                  label: "Mapa de Incumprimento & Quotas em Atraso",
                  desc: "Quotas pendentes, mora, avisos de cobrança e histórico de aviso"
                },
                {
                  id: "obras_manutencao",
                  icon: "fa-screwdriver-wrench",
                  label: "Relatório de Intervenções & Obras",
                  desc: "Vistorias técnicas, relatórios de higienização/limpeza e avarias"
                },
                {
                  id: "resumo_executivo",
                  icon: "fa-chart-pie",
                  label: "Resumo Executivo Geral do Edifício",
                  desc: "Síntese completa com permilagens, orçamentos e estado operacional"
                }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTipoRelatorio(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    tipoRelatorio === item.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    tipoRelatorio === item.id ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-snug">{item.label}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. OPÇÕES DE FILTRAGEM ADICIONAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Exercício / Período Temporal</label>
              <select
                value={exercicio}
                onChange={e => setExercicio(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-white"
              >
                <option value="Ano 2026">Ano do Exercício Actual (2026)</option>
                <option value="Ano 2025">Exercício Anterior (2025)</option>
                <option value="1º Semestre 2026">1º Semestre de 2026</option>
                <option value="Últimos 12 Meses">Últimos 12 Meses</option>
                <option value="Todo o Histórico">Todo o Histórico Registado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Opções de Inclusão no PDF</label>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={incluirInquilinos}
                    onChange={e => setIncluirInquilinos(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Incluir dados de inquilinos / arrendatários</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={incluirIbans}
                    onChange={e => setIncluirIbans(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Incluir IBANs e contas de liquidação</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={incluirAssinatura}
                    onChange={e => setIncluirAssinatura(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Incluir carimbo e assinatura digital da administração</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            * Filtro ativo: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{ambito}</strong> — <span className="capitalize">{tipoRelatorio.replace('_', ' ')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintHTML}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-print"></i>
              <span>Imprimir / Ver</span>
            </button>

            <button
              type="button"
              onClick={handleExportXLS}
              className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <img src="/modulos/66-exportacao-financeira.png" alt="Excel" className="h-4 w-4 object-contain" onError={(e) => { e.currentTarget.src = "/modulos/26-exportacao.png"; }} />
              <span>Excel (XLS)</span>
            </button>

            <button
              type="button"
              onClick={handleGeneratePDF}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <img src="/modulos/80-pdf-de-resultados.png" alt="PDF" className="h-4 w-4 object-contain" onError={(e) => { e.currentTarget.src = "/modulos/25-relatorio.png"; }} />
              <span>Gerar Relatório PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
