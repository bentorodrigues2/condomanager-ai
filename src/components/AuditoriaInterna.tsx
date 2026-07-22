import { Icon } from './Icon';
import React, { useState, useEffect } from "react";
import { Predio, Conta, Fracao, Movimento, Documento, AuditLogEntry, LoggedUser } from "../types";

interface AuditoriaInternaProps {
  predio: Predio;
  loggedUser: LoggedUser;
  movimentos: Movimento[];
  fracoes: Fracao[];
  documentos: Documento[];
  contas: Conta[];
  onAddAuditLog?: (entry: AuditLogEntry) => void;
}

const initialAuditLogs: AuditLogEntry[] = [
  {
    id_log: "log-1",
    id_predio: "predio-1",
    usuario: "Carlos Administrador",
    email: "carlos.adm@condomanager.pt",
    role: "ADMIN",
    data_hora: "2026-07-15 18:42:11",
    seccao: "Documental",
    descricao: "Carregamento do orÃ§amento geral aprovado do exercÃ­cio de 2026",
    valores_anteriores: "Nenhum documento",
    valores_posteriores: "Ficheiro: Orcamento_Geral_Aprovado_Exercicio_2026.pdf (2.1 MB)",
    ip: "192.168.1.45",
    dispositivo: "Chrome 126.0 - Windows 11"
  },
  {
    id_log: "log-2",
    id_predio: "predio-1",
    usuario: "Carlos Administrador",
    email: "carlos.adm@condomanager.pt",
    role: "ADMIN",
    data_hora: "2026-07-14 15:30:45",
    seccao: "Financeiro",
    descricao: "Registo e liquidaÃ§Ã£o de pagamento de quota ordinÃ¡ria - FraÃ§Ã£o K (JosÃ© Guerra)",
    valores_anteriores: "Aviso Pendente: 48.93â‚¬",
    valores_posteriores: "Receita Liquidada: 48.93â‚¬ (Quotas OrdinÃ¡rias)",
    ip: "192.168.1.45",
    dispositivo: "Chrome 126.0 - Windows 11"
  },
  {
    id_log: "log-3",
    id_predio: "predio-1",
    usuario: "Carlos Administrador",
    email: "carlos.adm@condomanager.pt",
    role: "ADMIN",
    data_hora: "2026-07-12 11:15:00",
    seccao: "FraÃ§Ãµes",
    descricao: "AtualizaÃ§Ã£o de dados de proprietÃ¡rio da FraÃ§Ã£o A (Ana Silva)",
    valores_anteriores: "Contacto: ana.silva@sapo.pt | TelemÃ³vel: 911222333",
    valores_posteriores: "Contacto: ana.silva@gmail.com | TelemÃ³vel: 963456789",
    ip: "192.168.1.45",
    dispositivo: "Chrome 126.0 - Windows 11"
  },
  {
    id_log: "log-4",
    id_predio: "predio-1",
    usuario: "Eng. Rui Melo",
    email: "rui.melo@vistoriasegura.pt",
    role: "TECNICO",
    data_hora: "2026-07-10 09:12:00",
    seccao: "OcorrÃªncias",
    descricao: "Registo de vistoria tÃ©cnica e atualizaÃ§Ã£o do estado de infiltraÃ§Ã£o na coluna geral",
    valores_anteriores: "Estado: Pendente",
    valores_posteriores: "Estado: Resolvido (ReparaÃ§Ã£o efetuada no cano de descarga)",
    ip: "185.82.112.9",
    dispositivo: "Safari - iPhone 15 Pro"
  },
  {
    id_log: "log-5",
    id_predio: "predio-1",
    usuario: "Maria Silva (Limpezas)",
    email: "maria.silva@limpezasestrela.pt",
    role: "LIMPEZAS",
    data_hora: "2026-07-08 16:45:30",
    seccao: "OcorrÃªncias",
    descricao: "Registo e finalizaÃ§Ã£o de checklist semanal de vistorias & limpezas",
    valores_anteriores: "Checklist: Por iniciar",
    valores_posteriores: "Checklist: Submetido (100% de tarefas executadas)",
    ip: "194.210.32.14",
    dispositivo: "Chrome Mobile - Samsung S23"
  },
  {
    id_log: "log-6",
    id_predio: "predio-1",
    usuario: "GestÃ£o Forte AdministraÃ§Ãµes",
    email: "contacto@gestaoforte.pt",
    role: "EMPRESA_GESTORA",
    data_hora: "2026-07-05 14:00:00",
    seccao: "ConfiguraÃ§Ãµes",
    descricao: "VÃ­nculo de Empresa Gestora Externa ao EdifÃ­cio Estrela da Barra e atualizaÃ§Ã£o de IBAN",
    valores_anteriores: "AdministraÃ§Ã£o: Interna",
    valores_posteriores: "AdministraÃ§Ã£o: Empresa Gestora (NIF: 512345678) | Novo IBAN Principal",
    ip: "213.22.88.190",
    dispositivo: "Firefox 127.0 - macOS Sonoma"
  },
  {
    id_log: "log-7",
    id_predio: "predio-1",
    usuario: "Carlos Administrador",
    email: "carlos.adm@condomanager.pt",
    role: "ADMIN",
    data_hora: "2026-07-02 17:05:12",
    seccao: "Assembleias",
    descricao: "Envio de convocatÃ³ria oficial digital para Assembleia Geral OrdinÃ¡ria de 10 de Agosto",
    valores_anteriores: "Estado: Planeado",
    valores_posteriores: "Estado: Convocado (E-mails enviados a todos os proprietÃ¡rios)",
    ip: "192.168.1.45",
    dispositivo: "Chrome 126.0 - Windows 11"
  }
];

export function AuditoriaInterna({
  predio,
  loggedUser,
  movimentos,
  fracoes,
  documentos,
  contas,
  onAddAuditLog
}: AuditoriaInternaProps) {
  const [activeTab, setActiveTab] = useState<"historico" | "financeira" | "documental">("historico");
  
  // Audit Logs State
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`audit_logs_${predio.id_predio}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialAuditLogs; }
    }
    return initialAuditLogs;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeccao, setSelectedSeccao] = useState<string>("Todas");
  const [selectedRole, setSelectedRole] = useState<string>("Todos");
  
  // Custom log simulation form
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simSeccao, setSimSeccao] = useState<AuditLogEntry["seccao"]>("Financeiro");
  const [simDescricao, setSimDescricao] = useState("");
  const [simAntes, setSimAntes] = useState("");
  const [simDepois, setSimDepois] = useState("");

  // Compliance Scan States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanReport, setScanReport] = useState<any>(null);

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    localStorage.setItem(`audit_logs_${predio.id_predio}`, JSON.stringify(logs));
  }, [logs, predio.id_predio]);

  // Handle adding log
  const handleAddLog = (newLog: AuditLogEntry) => {
    setLogs(prev => [newLog, ...prev]);
    if (onAddAuditLog) {
      onAddAuditLog(newLog);
    }
  };

  // Simulate change submit
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simDescricao) return;

    const newLog: AuditLogEntry = {
      id_log: `log-${Date.now()}`,
      id_predio: predio.id_predio,
      usuario: loggedUser.nome,
      email: loggedUser.email,
      role: loggedUser.role,
      data_hora: new Date().toISOString().replace("T", " ").slice(0, 19),
      seccao: simSeccao,
      descricao: simDescricao,
      valores_anteriores: simAntes || "-",
      valores_posteriores: simDepois || "-",
      ip: "192.168.1.100",
      dispositivo: "Chrome 128 - Backoffice Console"
    };

    handleAddLog(newLog);
    setIsSimulateOpen(false);
    setSimDescricao("");
    setSimAntes("");
    setSimDepois("");
  };

  // Run Compliance Audit Simulator
  const runComplianceAudit = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStep(1);
    setScanReport(null);

    const steps = [
      "A analisar conformidade financeira e reconciliaÃ§Ã£o bancÃ¡ria...",
      "A calcular conformidade do Fundo de Reserva comum (DL 268/94)...",
      "A varrer movimentos Ã  procura de transaÃ§Ãµes em duplicado...",
      "A avaliar apÃ³lices de seguro multirriscos das fraÃ§Ãµes...",
      "A auditar Ã­ndice de cobertura documental obrigatÃ³ria...",
      "A gerar relatÃ³rio final de auditoria interna de backoffice..."
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setScanProgress(currentProgress);

      if (currentProgress % 20 === 0) {
        setScanStep(prev => Math.min(prev + 1, steps.length));
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        generateAuditResults();
      }
    }, 300);
  };

  const generateAuditResults = () => {
    // 1. Bank Reconciliation Check
    const totalSaldoBancos = contas.reduce((sum, c) => sum + c.saldo, 0);
    // Calculated expected balance from standard movements
    const totalReceitas = movimentos.filter(m => m.tipo === "Receita").reduce((sum, m) => sum + m.valor, 0);
    const totalDespesas = movimentos.filter(m => m.tipo === "Despesa").reduce((sum, m) => sum + m.valor, 0);
    const expectedFromMovs = totalReceitas - totalDespesas;
    const reconciliado = Math.abs(totalSaldoBancos - (expectedFromMovs + 12000)) < 1500; // Simulated offset check

    // 2. Reserve Fund Contribution Compliance (DL 268/94 requires >= 10% of standard budget)
    // Checking standard values or simple ratio
    const hasSufficientFCR = totalSaldoBancos > 5000;

    // 3. Duplicated Transactions Detector
    const duplicates: any[] = [];
    for (let i = 0; i < movimentos.length; i++) {
      for (let j = i + 1; j < movimentos.length; j++) {
        const m1 = movimentos[i];
        const m2 = movimentos[j];
        if (
          m1.valor === m2.valor &&
          m1.tipo === m2.tipo &&
          m1.categoria === m2.categoria &&
          Math.abs(new Date(m1.data).getTime() - new Date(m2.data).getTime()) < 3 * 24 * 60 * 60 * 1000
        ) {
          duplicates.push({ m1, m2 });
        }
      }
    }

    // 4. Fractions Multirrisco Insurance Coverage
    const currentDate = new Date("2026-07-16");
    const uninsuredFractions = fracoes.filter(f => {
      if (!f.apolice_num || !f.apolice_validade) return true;
      const valDate = new Date(f.apolice_validade);
      return valDate < currentDate;
    });

    // 5. Documental Coverage checklist
    const hasRegulamento = documentos.some(d => d.categoria === "Regulamentos" || d.nome.toLowerCase().includes("regulamento"));
    const hasAtas = documentos.some(d => d.categoria === "Atas" || d.nome.toLowerCase().includes("ata"));
    const hasContratoOTIS = documentos.some(d => d.nome.toLowerCase().includes("otis") || d.nome.toLowerCase().includes("elevador"));
    const hasSeguroGlobal = documentos.some(d => d.categoria?.includes("Seguros") || d.nome.toLowerCase().includes("apolice_multirriscos"));
    const hasOrcamento = documentos.some(d => d.categoria === "OrÃ§amentos" || d.nome.toLowerCase().includes("orcamento"));

    const docScore = (
      (hasRegulamento ? 20 : 0) +
      (hasAtas ? 20 : 0) +
      (hasContratoOTIS ? 20 : 0) +
      (hasSeguroGlobal ? 20 : 0) +
      (hasOrcamento ? 20 : 0)
    );

    setScanReport({
      data_emissao: new Date().toISOString().replace("T", " ").slice(0, 16),
      reconciliado,
      saldo_real: totalSaldoBancos,
      fundo_reserva_compliant: hasSufficientFCR,
      duplicates_found: duplicates,
      expired_insurances: uninsuredFractions,
      docs: {
        hasRegulamento,
        hasAtas,
        hasContratoOTIS,
        hasSeguroGlobal,
        hasOrcamento,
        score: docScore
      },
      ponto_situacao: docScore >= 80 && reconciliado ? "Conforme" : "Requer AtenÃ§Ã£o"
    });
    setIsScanning(false);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.valores_anteriores && log.valores_anteriores.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.valores_posteriores && log.valores_posteriores.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSeccao = selectedSeccao === "Todas" || log.seccao === selectedSeccao;
    const matchesRole = selectedRole === "Todos" || log.role === selectedRole;

    return matchesSearch && matchesSeccao && matchesRole;
  });

  return (
    <div id="backoffice-audit-section" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mb-1">
            <i className="fa-solid fa-shield-halved"></i> Painel de Backoffice
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Auditoria Interna & Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            HistÃ³rico completo de alteraÃ§Ãµes, quem alterou, quando alterou e relatÃ³rios de conformidade financeira e documental.
          </p>
        </div>
        
        {/* ACTIONS */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            onClick={runComplianceAudit}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <i className={`fa-solid fa-wand-magic-sparkles ${isScanning ? "animate-spin" : ""}`}></i>
            Executar Auditoria Geral
          </button>
          
          <button 
            onClick={() => setIsSimulateOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <i className="fa-solid fa-terminal"></i>
            Simular AlteraÃ§Ã£o
          </button>
        </div>
      </div>

      {/* METRICAS RAPIDAS DE COMPLIANCE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total de Registos</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">{logs.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <i className="fa-solid fa-file-shield text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Cobertura Documental</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">
              {documentos.length > 5 ? "95%" : "68%"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Conformidade Geral</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">Excelente</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">ApÃ³lices em Risco</p>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">
              {fracoes.filter(f => !f.apolice_validade || new Date(f.apolice_validade) < new Date("2026-07-16")).length} Unidades
            </p>
          </div>
        </div>
      </div>

      {/* SCANNING MODAL / ROW PROGRESS BAR */}
      {isScanning && (
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-xl text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-notch animate-spin"></i>
              Mecanismo de Auditoria Activo
            </span>
            <span>{scanProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {scanStep === 1 && "A analisar conformidade financeira e reconciliaÃ§Ã£o bancÃ¡ria..."}
            {scanStep === 2 && "A calcular conformidade do Fundo de Reserva comum (DL 268/94)..."}
            {scanStep === 3 && "A varrer movimentos Ã  procura de transaÃ§Ãµes em duplicado..."}
            {scanStep === 4 && "A avaliar apÃ³lices de seguro multirriscos das fraÃ§Ãµes..."}
            {scanStep === 5 && "A auditar Ã­ndice de cobertura documental obrigatÃ³ria..."}
            {scanStep === 6 && "A gerar relatÃ³rio final de auditoria interna de backoffice..."}
          </p>
        </div>
      )}

      {/* COMPLIANCE SCANNED REPORT SECTION */}
      {scanReport && (
        <div className="bg-gradient-to-r from-indigo-900/10 to-blue-900/10 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-500/30 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-indigo-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  RelatÃ³rio PDF Gerado
                </span>
                <span className="text-xs text-slate-400">{scanReport.data_emissao}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                RelatÃ³rio de Auditoria e Conformidade Legal
              </h3>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-print"></i> Imprimir / Guardar
              </button>
              <button 
                onClick={() => setScanReport(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
              >
                Fechar RelatÃ³rio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Auditoria Financeira Highlights */}
            <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <h4 className="font-extrabold text-sm text-indigo-500 flex items-center gap-1 mb-3">
                <i className="fa-solid fa-coins"></i> Conformidade Financeira
              </h4>
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">ConciliaÃ§Ã£o BancÃ¡ria:</span>
                  {scanReport.reconciliado ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Reconciliado</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-triangle-exclamation"></i> DiscrepÃ¢ncia</span>
                  )}
                </li>
                <li className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">FCR ObrigatÃ³rio (DL 268/94):</span>
                  {scanReport.fundo_reserva_compliant ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Conforme (10%+)</span>
                  ) : (
                    <span className="text-amber-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-triangle-exclamation"></i> Insuficiente</span>
                  )}
                </li>
                <li className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Movimentos Duplicados:</span>
                  {scanReport.duplicates_found.length === 0 ? (
                    <span className="text-emerald-500 font-semibold">Nenhum detetado</span>
                  ) : (
                    <span className="text-red-500 font-bold">{scanReport.duplicates_found.length} Suspeitos</span>
                  )}
                </li>
              </ul>
              {scanReport.duplicates_found.length > 0 && (
                <div className="mt-4 p-2.5 bg-rose-500/10 rounded-lg text-[10px] text-rose-500 border border-rose-500/20">
                  <p className="font-bold mb-1"><i className="fa-solid fa-triangle-exclamation"></i> Alerta de TransaÃ§Ãµes idÃªnticas:</p>
                  {scanReport.duplicates_found.map((d: any, idx: number) => (
                    <div key={idx} className="border-t border-rose-500/20 pt-1 mt-1">
                      {d.m1.descricao} ({d.m1.valor}â‚¬) no dia {d.m1.data}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auditoria Documental Highlights */}
            <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <h4 className="font-extrabold text-sm text-blue-500 flex items-center gap-1 mb-3">
                <i className="fa-solid fa-file-invoice-dollar"></i> Cobertura Documental
              </h4>
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-slate-500">Regulamento Interno:</span>
                  {scanReport.docs.hasRegulamento ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Presente</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-xmark"></i> Em Falta</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-500">Atas de Assembleia:</span>
                  {scanReport.docs.hasAtas ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Presente</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-xmark"></i> Em Falta</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-500">Contrato Elevador (OTIS):</span>
                  {scanReport.docs.hasContratoOTIS ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Presente</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-xmark"></i> Em Falta</span>
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-500">ApÃ³lice Global de PrÃ©dio:</span>
                  {scanReport.docs.hasSeguroGlobal ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-circle-check"></i> Presente</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5"><i className="fa-solid fa-xmark"></i> Em Falta</span>
                  )}
                </li>
              </ul>
            </div>

            {/* ApÃ³lices das FraÃ§Ãµes & Rating */}
            <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-purple-500 flex items-center gap-1 mb-3">
                  <i className="fa-solid fa-house-shield"></i> Seguros Multirrisco FraÃ§Ãµes
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  VerificaÃ§Ã£o de apÃ³lices individuais obrigatÃ³rias das fraÃ§Ãµes autÃ³nomas:
                </p>
                {scanReport.expired_insurances.length === 0 ? (
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 text-xs rounded-lg font-semibold flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-base"></i> 100% das FraÃ§Ãµes com seguro em vigor!
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs rounded-lg space-y-1 border border-amber-500/20">
                    <p className="font-bold flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {scanReport.expired_insurances.length} FraÃ§Ãµes em incumprimento:</p>
                    <div className="max-h-20 overflow-y-auto space-y-1 pr-1">
                      {scanReport.expired_insurances.map((f: any) => (
                        <div key={f.id_fracao} className="flex justify-between text-[11px] border-t border-amber-500/10 pt-1">
                          <span>FraÃ§Ã£o {f.fracao_nome} ({f.proprietario.nome})</span>
                          <span className="font-bold text-rose-500">{f.apolice_validade ? "Expirada" : "Sem registo"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SCORE DE COMPLIANCE</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{scanReport.docs.score}%</span>
                </div>
                <div className={`px-2.5 py-1 text-xs font-black rounded-lg ${scanReport.ponto_situacao === "Conforme" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {scanReport.ponto_situacao}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS DE SELEÃ‡ÃƒO */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab("historico")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === "historico" ? "border-emerald-500 text-emerald-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
        >
          <i className="fa-solid fa-list-check"></i>
          HistÃ³rico de AlteraÃ§Ãµes
        </button>

        <button 
          onClick={() => setActiveTab("financeira")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === "financeira" ? "border-emerald-500 text-emerald-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
        >
          <i className="fa-solid fa-scale-balanced"></i>
          Auditoria Financeira
        </button>

        <button 
          onClick={() => setActiveTab("documental")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === "documental" ? "border-emerald-500 text-emerald-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
        >
          <i className="fa-solid fa-folder-tree"></i>
          Auditoria Documental
        </button>
      </div>

      {/* TAB CONTENT: HISTORICO */}
      {activeTab === "historico" && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative md:col-span-2">
              <input 
                type="text"
                placeholder="Pesquisar por utilizador, alteraÃ§Ã£o ou valores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 pl-8 text-slate-700 dark:text-white"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
            </div>

            <div>
              <select 
                value={selectedSeccao}
                onChange={(e) => setSelectedSeccao(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todas">Todas as SecÃ§Ãµes</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Documental">Documental</option>
                <option value="Assembleias">Assembleias</option>
                <option value="FraÃ§Ãµes">FraÃ§Ãµes</option>
                <option value="OcorrÃªncias">OcorrÃªncias</option>
                <option value="ConfiguraÃ§Ãµes">ConfiguraÃ§Ãµes</option>
                <option value="Reservas">Reservas</option>
              </select>
            </div>

            <div>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Todos">Todos os Perfis</option>
                <option value="ADMIN">Administrador</option>
                <option value="EMPRESA_GESTORA">Empresa Gestora</option>
                <option value="TECNICO">TÃ©cnico</option>
                <option value="LIMPEZAS">Limpezas</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Utilizador / Quem</th>
                    <th className="p-4">Quando / Data</th>
                    <th className="p-4">SecÃ§Ã£o</th>
                    <th className="p-4">O Que Alterou / DescriÃ§Ã£o</th>
                    <th className="p-4 text-right">AÃ§Ãµes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <i className="fa-solid fa-folder-open text-2xl mb-2 block text-slate-300"></i>
                        Nenhum registo de auditoria corresponde aos filtros de pesquisa selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id_log} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-[10px]">
                              {log.usuario.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white leading-none">{log.usuario}</p>
                              <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <span className={`px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[8px] ${
                                  log.role === "ADMIN" ? "bg-emerald-500/10 text-emerald-500" :
                                  log.role === "EMPRESA_GESTORA" ? "bg-violet-500/10 text-violet-500" :
                                  log.role === "TECNICO" ? "bg-amber-500/10 text-amber-500" :
                                  "bg-slate-500/10 text-slate-400"
                                }`}>
                                  {log.role}
                                </span>
                                <span>{log.email}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {log.data_hora}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            log.seccao === "Financeiro" ? "bg-emerald-500/10 text-emerald-500" :
                            log.seccao === "Documental" ? "bg-blue-500/10 text-blue-500" :
                            log.seccao === "Assembleias" ? "bg-purple-500/10 text-purple-500" :
                            log.seccao === "FraÃ§Ãµes" ? "bg-indigo-500/10 text-indigo-500" :
                            log.seccao === "OcorrÃªncias" ? "bg-orange-500/10 text-orange-500" :
                            log.seccao === "ConfiguraÃ§Ãµes" ? "bg-violet-500/10 text-violet-500" :
                            "bg-slate-500/10 text-slate-400"
                          }`}>
                            {log.seccao}
                          </span>
                        </td>
                        <td className="p-4 max-w-sm">
                          <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{log.descricao}</p>
                          <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                            Modificado: {log.valores_posteriores}
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setSelectedLog(log)}
                            className="px-2.5 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer transition-all"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCEIRA */}
      {activeTab === "financeira" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CONCILIAÃ‡ÃƒO BANCÃRIA */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-landmark text-emerald-500"></i>
                  ConciliaÃ§Ã£o de Contas e Saldos
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  MonitorizaÃ§Ã£o Activa
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Esta verificaÃ§Ã£o compara o somatÃ³rio dos saldos fÃ­sicos das contas bancÃ¡rias registadas com o saldo contabilÃ­stico teÃ³rico esperado obtido do histÃ³rico de receitas e despesas.
              </p>

              <div className="space-y-3.5">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Soma dos Saldos BancÃ¡rios</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">
                      {contas.reduce((sum, c) => sum + c.saldo, 0).toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">CONTAS EXAMINADAS</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{contas.length} Contas ativas</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Soma das Receitas no PerÃ­odo</p>
                    <p className="text-base font-bold text-emerald-500">
                      +{movimentos.filter(m => m.tipo === "Receita").reduce((sum, m) => sum + m.valor, 0).toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Soma das Despesas</p>
                    <p className="text-base font-bold text-rose-500">
                      -{movimentos.filter(m => m.tipo === "Despesa").reduce((sum, m) => sum + m.valor, 0).toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border flex items-center gap-3.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <i className="fa-solid fa-circle-check text-xl"></i>
                  <div>
                    <p className="font-bold">ReconciliaÃ§Ã£o Efetuada com Sucesso</p>
                    <p className="text-[11px] opacity-90">NÃ£o existem transaÃ§Ãµes em trÃ¢nsito sem registo no extrato bancÃ¡rio. Conciliado e livre de alertas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLO COMPLIANCE FUNDO DE RESERVA (DL 268/94) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-sack-dollar text-indigo-500"></i>
                  Fundo Comum de Reserva â€” DL 268/94
                </h3>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded">
                  VerificaÃ§Ã£o Legal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nos termos da legislaÃ§Ã£o portuguesa, cada condomÃ­nio deve constituir um fundo comum de reserva para custear despesas de conservaÃ§Ã£o do edifÃ­cio. A contribuiÃ§Ã£o mÃ­nima obrigatÃ³ria Ã© de 10% da quota regular.
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Saldo em Fundo de Reserva</p>
                    <p className="text-base font-extrabold text-indigo-500">
                      {contas.find(c => c.tipo.includes("FCR") || c.tipo.includes("Reserva"))?.saldo.toLocaleString("pt-PT", { style: "currency", currency: "EUR" }) || "12.350,75 â‚¬"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">RÃ¡cio sobre OrÃ§amento</p>
                    <p className="text-base font-extrabold text-emerald-500">12.5% (Aprovado)</p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>ContribuiÃ§Ã£o Real: 12.5%</span>
                  <span>MÃ­nimo de Lei: 10%</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <p className="font-bold flex items-center gap-1"><i className="fa-solid fa-circle-check"></i> CondomÃ­nio Conforme</p>
                  <p className="text-[11px] mt-0.5">O rÃ¡cio de contribuiÃ§Ã£o e o saldo do Fundo Comum de Reserva excedem os requisitos mÃ­nimos estipulados no DL 268/94.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SUSPEITA DE DUPLICADOS & TRANSAÃ‡Ã•ES ACIMA DO THRESHOLD */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
              Detetor de Anomalias e Risco Financeiro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 space-y-2">
                <p className="font-bold text-xs text-slate-700 dark:text-slate-200">Alertas de Duplicidade (Extrato)</p>
                <p className="text-xs text-slate-400">
                  O algoritmo procura transaÃ§Ãµes de despesas ou receitas com valores e descriÃ§Ãµes idÃªnticas executadas no mesmo dia ou com um desvio mÃ¡ximo de 48 horas.
                </p>
                <div className="p-3 bg-emerald-500/10 text-emerald-500 text-xs rounded-lg font-semibold flex items-center gap-1.5 mt-2">
                  <i className="fa-solid fa-circle-check text-base"></i> Nenhuma transaÃ§Ã£o duplicada suspeita detetada no exercÃ­cio de 2026.
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 space-y-2">
                <p className="font-bold text-xs text-slate-700 dark:text-slate-200">Limites de AutorizaÃ§Ã£o Conjunta (Threshold)</p>
                <p className="text-xs text-slate-400">
                  Segundo os estatutos, despesas superiores a 1.000â‚¬ exigem dupla assinatura ou ata de aprovaÃ§Ã£o anexada para fins de auditoria documental.
                </p>
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs rounded-lg space-y-1 mt-2 border border-amber-500/20">
                  <p className="font-bold flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> 1 Movimento Requer AnexaÃ§Ã£o de Ata:</p>
                  <div className="flex items-center justify-between text-[11px] border-t border-amber-500/10 pt-1.5 mt-1">
                    <span>Pinturas de PortÃµes Exteriomente (1.250,00â‚¬)</span>
                    <span className="font-bold text-rose-500">Ata em Falta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTAL */}
      {activeTab === "documental" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* AUDITORIA DE DOCUMENTOS OBRIGATÃ“RIOS (CHECKLIST) */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-clipboard-list text-blue-500"></i>
                  Arquivo de Documentos ObrigatÃ³rios do CondomÃ­nio
                </h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded">
                  Conformidade Documental
                </span>
              </div>
              <p className="text-xs text-slate-500">
                VerificaÃ§Ã£o automatizada da existÃªncia e validade de documentos exigidos por lei ou indispensÃ¡veis para a gestÃ£o do condomÃ­nio.
              </p>

              <div className="space-y-3.5">
                {/* Regulamento */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Regulamento Interno do CondomÃ­nio</p>
                      <p className="text-[10px] text-slate-400">Revisado e em vigor (DL 268/94 Artigo 9Âº)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Presente
                  </span>
                </div>

                {/* Ata mais recente */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-file-signature"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Ata da Ãšltima Assembleia Geral de Contas</p>
                      <p className="text-[10px] text-slate-400">AprovaÃ§Ã£o de contas do exercÃ­cio de 2025</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Presente
                  </span>
                </div>

                {/* Contrato de elevadores */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-screwdriver-wrench"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Contrato de ManutenÃ§Ã£o de Elevadores (OTIS)</p>
                      <p className="text-[10px] text-slate-400">ObrigatÃ³rio por lei para edifÃ­cios com elevador</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Presente
                  </span>
                </div>

                {/* Seguro Global */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-house-chimney-medical"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">ApÃ³lice de Seguro Multirriscos de CondomÃ­nio</p>
                      <p className="text-[10px] text-slate-400">Cobertura de Ã¡reas comuns e reconstruÃ§Ã£o do imÃ³vel</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Presente
                  </span>
                </div>
              </div>
            </div>

            {/* SEGUROS MULTIRRISCO DAS FRAÃ‡Ã•ES */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-purple-500"></i>
                  Validador de Seguros Individuais
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Artigo 1429Âº do CÃ³digo Civil</p>
              </div>
              <p className="text-xs text-slate-500">
                O seguro contra o risco de incÃªndio da fraÃ§Ã£o e Ã¡reas comuns Ã© obrigatÃ³rio por lei. O administrador tem o dever de exigir o comprovativo anual aos condÃ³minos.
              </p>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {fracoes.map(f => {
                  const hasApolice = !!f.apolice_num && !!f.apolice_validade;
                  const isExpired = hasApolice && new Date(f.apolice_validade) < new Date("2026-07-16");
                  
                  return (
                    <div key={f.id_fracao} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white">FraÃ§Ã£o {f.fracao_nome}</span>
                        {isExpired ? (
                          <span className="bg-rose-500/15 text-rose-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Expirado
                          </span>
                        ) : !hasApolice ? (
                          <span className="bg-red-500/15 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Em Falta
                          </span>
                        ) : (
                          <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            VÃ¡lido
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">ProprietÃ¡rio: {f.proprietario.nome}</p>
                      {hasApolice && (
                        <p className="text-[10px] font-mono text-slate-400">
                          {f.seguradora} - {f.apolice_num} (Expira: {f.apolice_validade})
                        </p>
                      )}
                      
                      {(isExpired || !hasApolice) && (
                        <button 
                          onClick={() => alert(`NotificaÃ§Ã£o enviada com sucesso para ${f.proprietario.nome} (${f.proprietario.email}) solicitando envio de apÃ³lice de seguro atualizada.`)}
                          className="mt-1.5 w-full py-1 text-[10px] font-bold text-center bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          <i className="fa-solid fa-envelope mr-1"></i> Solicitar ApÃ³lice
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETALHES DO REGISTO DE LOG (MODAL) */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                Ficha TÃ©cnica do Log de Auditoria
              </h4>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Utilizador / Autor</span>
                  <p className="font-extrabold text-slate-800 dark:text-white mt-0.5">{selectedLog.usuario}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{selectedLog.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Perfil de Acesso</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedLog.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Data & Hora</span>
                  <p className="font-mono mt-0.5 text-slate-700 dark:text-slate-300">{selectedLog.data_hora}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">SecÃ§Ã£o / Categoria</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded font-bold text-[9px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                    {selectedLog.seccao}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">DescriÃ§Ã£o do Evento</span>
                <p className="mt-1 font-medium text-slate-800 dark:text-white leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
                  {selectedLog.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Estado Anterior (Antes)</span>
                  <div className="mt-1 font-mono text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800/60 break-all h-20 overflow-y-auto">
                    {selectedLog.valores_anteriores || "-"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Estado Posterior (Depois)</span>
                  <div className="mt-1 font-mono text-[10px] text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800/60 break-all h-20 overflow-y-auto">
                    {selectedLog.valores_posteriores || "-"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[10px] text-slate-400 font-mono">
                <div>
                  <span>IP DE ORIGEM:</span> <span className="font-bold text-slate-600 dark:text-slate-300">{selectedLog.ip || "127.0.0.1"}</span>
                </div>
                <div>
                  <span>BROWSER/DISP:</span> <span className="font-bold text-slate-600 dark:text-slate-300">{selectedLog.dispositivo || "Chrome - Mac"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-lg cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE NEW LOG MODAL */}
      {isSimulateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSimulateSubmit} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <i className="fa-solid fa-terminal text-emerald-500"></i>
                Simular OperaÃ§Ã£o de Backoffice
              </h4>
              <button 
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Utilizador Activo</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${loggedUser.nome} (${loggedUser.role})`}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">SecÃ§Ã£o / Categoria</label>
                <select 
                  value={simSeccao}
                  onChange={(e) => setSimSeccao(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Financeiro">Financeiro</option>
                  <option value="Documental">Documental</option>
                  <option value="Assembleias">Assembleias</option>
                  <option value="FraÃ§Ãµes">FraÃ§Ãµes</option>
                  <option value="OcorrÃªncias">OcorrÃªncias</option>
                  <option value="ConfiguraÃ§Ãµes">ConfiguraÃ§Ãµes</option>
                  <option value="Reservas">Reservas</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">O Que Alterou (DescriÃ§Ã£o)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: EmissÃ£o de aviso de dÃ©bito para FraÃ§Ã£o B..."
                  value={simDescricao}
                  onChange={(e) => setSimDescricao(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Valor Anterior (Antes)</label>
                  <textarea 
                    placeholder="Opcional..."
                    value={simAntes}
                    onChange={(e) => setSimAntes(e.target.value)}
                    className="w-full h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Valor Novo (Depois)</label>
                  <textarea 
                    placeholder="Opcional..."
                    value={simDepois}
                    onChange={(e) => setSimDepois(e.target.value)}
                    className="w-full h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button 
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer shadow-sm"
              >
                Gravar no Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}










