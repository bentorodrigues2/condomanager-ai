import { Icon } from './Icon';
import React, { useState } from "react";
import { Predio, Fornecedor, LoggedUser } from "../types";
import { exportToXLS } from "../utils";

interface GestaoFornecedoresProps {
  predio: Predio;
  fornecedores: Fornecedor[];
  onAddFornecedor: (novoFornecedor: Fornecedor) => void;
  loggedUser: LoggedUser;
}

export interface Contrato {
  id_contrato: string;
  id_predio: string;
  id_fornecedor: string;
  servico: string;
  custo_mensal: number;
  custo_anual: number;
  renovacao_automatica: boolean;
  data_fim: string;
  alerta_renovacao: boolean;
  documento_nome?: string;
  documento_base64?: string;
}

export function GestaoFornecedores({ predio, fornecedores, onAddFornecedor, loggedUser }: GestaoFornecedoresProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"fornecedores" | "contratos">("fornecedores");

  // Suppliers form state
  const [nome, setNome] = useState("");
  const [nif, setNif] = useState("");
  const [iban, setIban] = useState("");
  const [categoria, setCategoria] = useState("");
  const [morada, setMorada] = useState("");
  const [contacto, setContacto] = useState("");
  const [pessoaContacto, setPessoaContacto] = useState("");
  const [telemovelDireto, setTelemovelDireto] = useState("");
  const [emailContacto, setEmailContacto] = useState("");

  // Contract state & simulated data store
  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id_contrato: "contr-1",
      id_predio: "predio-1",
      id_fornecedor: "forn-1", // Reference to first supplier (seeded below or in data.ts)
      servico: "ManutenÃ§Ã£o Preventiva de Elevadores (Contrato Mensal)",
      custo_mensal: 85.0,
      custo_anual: 1020.0,
      renovacao_automatica: true,
      data_fim: "2026-12-31",
      alerta_renovacao: true,
      documento_nome: "contrato_otis_elevador_assinado.pdf"
    },
    {
      id_contrato: "contr-2",
      id_predio: "predio-1",
      id_fornecedor: "forn-2",
      servico: "Seguro Multirriscos EdifÃ­cios (Anual)",
      custo_mensal: 29.17,
      custo_anual: 350.0,
      renovacao_automatica: true,
      data_fim: "2026-08-10", // Expiration within 30 days from 2026-07-16
      alerta_renovacao: true,
      documento_nome: "apolice_multirriscos_fidelidade_2026.pdf"
    }
  ]);

  // Global budget reference for impact evaluation
  const [orcamentoReferencia, setOrcamentoReferencia] = useState("5000");

  // New Contract Form State
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("");
  const [servicoNome, setServicoNome] = useState("");
  const [custoMensal, setCustoMensal] = useState("");
  const [custoAnual, setCustoAnual] = useState("");
  const [renovacaoAuto, setRenovacaoAuto] = useState(true);
  const [dataFim, setDataFim] = useState("2027-01-01");
  const [documentoNome, setDocumentoNome] = useState("");
  const [documentoBase64, setDocumentoBase64] = useState("");

  const predioForn = fornecedores.filter(f => f.id_predio === predio.id_predio);
  const predioContratos = contratos.filter(c => c.id_predio === predio.id_predio);

  // Auto calculate cost relations
  const handleCustoMensalChange = (val: string) => {
    setCustoMensal(val);
    if (val) {
      setCustoAnual((Number(val) * 12).toFixed(2));
    } else {
      setCustoAnual("");
    }
  };

  const handleCustoAnualChange = (val: string) => {
    setCustoAnual(val);
    if (val) {
      setCustoMensal((Number(val) / 12).toFixed(2));
    } else {
      setCustoMensal("");
    }
  };

  const handleContractFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocumentoNome(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setDocumentoBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const submeterFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedUser.role !== 'ADMIN' && loggedUser.role !== 'EMPRESA_GESTORA') {
      return alert("Apenas administradores podem cadastrar fornecedores!");
    }
    if (!nome || !nif || !categoria) return alert("Preencha todos os campos obrigatÃ³rios (Nome, NIF, Categoria)!");

    const novoId = "forn-" + (fornecedores.length + 1);
    const novo: Fornecedor = {
      id_fornecedor: novoId,
      id_predio: predio.id_predio,
      nome,
      nif,
      iban: iban || undefined,
      categoria,
      morada,
      contacto,
      pessoa_contacto: pessoaContacto,
      telemovel_direto: telemovelDireto,
      email_contacto: emailContacto || undefined
    };
    onAddFornecedor(novo);
    
    // Automatically select this new supplier in contract form if they want to build one next
    setSelectedFornecedorId(novoId);

    setNome(""); setNif(""); setIban(""); setCategoria(""); setMorada(""); setContacto(""); setPessoaContacto(""); setTelemovelDireto(""); setEmailContacto("");
    alert("Fornecedor registado com sucesso!");
  };

  const submeterContrato = (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedUser.role !== 'ADMIN' && loggedUser.role !== 'EMPRESA_GESTORA') {
      return alert("Apenas administradores podem cadastrar contratos!");
    }
    if (!selectedFornecedorId || !servicoNome || !custoAnual) {
      return alert("Preencha todos os campos obrigatÃ³rios (Fornecedor, ServiÃ§o, Custo)!");
    }

    const cMensal = Number(custoMensal) || 0;
    const cAnual = Number(custoAnual) || 0;

    const novoContrato: Contrato = {
      id_contrato: "contr-" + (contratos.length + 1),
      id_predio: predio.id_predio,
      id_fornecedor: selectedFornecedorId,
      servico: servicoNome,
      custo_mensal: cMensal,
      custo_anual: cAnual,
      renovacao_automatica: renovacaoAuto,
      data_fim: dataFim,
      alerta_renovacao: true,
      documento_nome: documentoNome || undefined,
      documento_base64: documentoBase64 || undefined
    };

    setContratos([novoContrato, ...contratos]);
    setServicoNome("");
    setCustoMensal("");
    setCustoAnual("");
    setDocumentoNome("");
    setDocumentoBase64("");
    alert("ServiÃ§o Contratado registado e arquivado no sistema!");
  };

  const excluirContrato = (id: string) => {
    if (!window.confirm("Deseja realmente arquivar/remover este contrato?")) return;
    setContratos(contratos.filter(c => c.id_contrato !== id));
  };

  const exportarFornecedoresXLS = () => {
    const headers = ["Nome", "NIF", "IBAN", "Categoria", "Contacto Geral", "Pessoa de Contacto", "E-mail de Contacto", "TelemÃ³vel Direto", "Morada"];
    const rows = predioForn.map(f => [
      f.nome,
      f.nif,
      f.iban || "N/A",
      f.categoria,
      f.contacto || "",
      f.pessoa_contacto || "",
      f.email_contacto || "",
      f.telemovel_direto || "",
      f.morada || ""
    ]);
    exportToXLS("Lista_Fornecedores_Condominio", headers, rows);
  };

  // Helper to check expiration within 30 days (based on local date 2026-07-16)
  const isExpiringSoon = (dateStr: string) => {
    const baseDate = new Date("2026-07-16");
    const expDate = new Date(dateStr);
    const diffTime = expDate.getTime() - baseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  // Sum active contracted services costs
  const totalMensalContratos = predioContratos.reduce((acc, curr) => acc + curr.custo_mensal, 0);
  const totalAnualContratos = predioContratos.reduce((acc, curr) => acc + curr.custo_anual, 0);
  const orcReferenciaNum = Number(orcamentoReferencia) || 5000;
  const impactoOrcamentoContratos = (totalAnualContratos / orcReferenciaNum) * 100;

  return (
    <div className="space-y-6">
      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 pb-px no-print">
        <button
          onClick={() => setActiveTab("fornecedores")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "fornecedores" 
              ? "border-emerald-500 text-emerald-600 font-black" 
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className="fa-solid fa-users mr-1.5"></i>Parceiros e Fornecedores Registados
        </button>
        <button
          onClick={() => setActiveTab("contratos")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "contratos" 
              ? "border-indigo-500 text-indigo-600 font-black" 
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <i className="fa-solid fa-file-contract mr-1.5"></i>ServiÃ§os Contratados & Contratos
        </button>
      </div>

      {activeTab === "fornecedores" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center no-print">
            <h4 className="text-xs font-bold uppercase text-slate-400">ExportaÃ§Ãµes de RelatÃ³rios</h4>
            <button onClick={exportarFornecedoresXLS} className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-all cursor-pointer">
              <i className="fa-solid fa-file-excel mr-1"></i> Exportar Fornecedores XLS / CSV
            </button>
          </div>

          {(loggedUser.role === 'ADMIN' || loggedUser.role === 'EMPRESA_GESTORA') && (
            <form onSubmit={submeterFornecedor} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 no-print">
              <h3 className="text-sm font-bold text-slate-800">Cadastrar Novo Fornecedor do CondomÃ­nio</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col col-span-2">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Nome do Parceiro / Empresa *</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: OTIS Elevadores" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">NIF Contribuinte *</label>
                  <input type="text" value={nif} onChange={e => setNif(e.target.value)} placeholder="Ex: 500112233" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500 font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Categoria de Despesa *</label>
                  <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: ManutenÃ§Ã£o Elevadores" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">IBAN de Pagamento</label>
                  <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="PT50..." className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500 font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Contacto Geral</label>
                  <input type="text" value={contacto} onChange={e => setContacto(e.target.value)} placeholder="Ex: 214156000" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500 font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Pessoa de Contacto</label>
                  <input type="text" value={pessoaContacto} onChange={e => setPessoaContacto(e.target.value)} placeholder="Ex: Eng. JoÃ£o Costa" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">E-mail de Contacto</label>
                  <input type="email" value={emailContacto} onChange={e => setEmailContacto(e.target.value)} placeholder="Ex: joao.costa@empresa.com" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500 font-mono" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">TelemÃ³vel Direto</label>
                  <input type="text" value={telemovelDireto} onChange={e => setTelemovelDireto(e.target.value)} placeholder="Ex: 912345678" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500 font-mono" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 mb-1">Morada de OperaÃ§Ãµes / Sede</label>
                <input type="text" value={morada} onChange={e => setMorada(e.target.value)} placeholder="Morada fÃ­sica do fornecedor" className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-emerald-500" />
              </div>

              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer">
                <i className="fa-solid fa-plus mr-1.5"></i> Registar Fornecedor
              </button>
            </form>
          )}

          {/* Lista de Fornecedores */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="p-3">Nome / Empresa</th>
                  <th className="p-3">NIF</th>
                  <th className="p-3">IBAN de CobranÃ§a</th>
                  <th className="p-3">Contactos & Morada</th>
                  <th className="p-3">Categoria PadrÃ£o</th>
                </tr>
              </thead>
              <tbody>
                {predioForn.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400 italic">Nenhum fornecedor cadastrado.</td>
                  </tr>
                ) : (
                  predioForn.map(f => (
                    <tr key={f.id_fornecedor} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800">{f.nome}</td>
                      <td className="p-3 font-mono">{f.nif}</td>
                      <td className="p-3 font-mono text-slate-600">{f.iban || <span className="text-slate-400 italic">NÃ£o Fornecido</span>}</td>
                      <td className="p-3 text-slate-600 space-y-1">
                        {f.contacto && <p className="font-mono"><i className="fa-solid fa-phone mr-1.5 text-slate-400"></i><span className="font-semibold text-slate-500">Geral:</span> {f.contacto}</p>}
                        {f.pessoa_contacto && <p><i className="fa-solid fa-user-tie mr-1.5 text-slate-400"></i><span className="font-semibold text-slate-500">Pessoa:</span> {f.pessoa_contacto}</p>}
                        {f.email_contacto && <p className="font-mono"><i className="fa-solid fa-envelope mr-1.5 text-slate-400"></i><span className="font-semibold text-slate-500">E-mail:</span> {f.email_contacto}</p>}
                        {f.telemovel_direto && <p className="font-mono"><i className="fa-solid fa-mobile-screen-button mr-1.5 text-slate-400"></i><span className="font-semibold text-slate-500">TelemÃ³vel Direto:</span> {f.telemovel_direto}</p>}
                        {f.morada && <p><i className="fa-solid fa-location-dot mr-1.5 text-slate-400"></i>{f.morada}</p>}
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">{f.categoria}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "contratos" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Contracts General Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide block">Despesa Mensal de Contratos</span>
                <h3 className="text-xl font-black text-slate-800 font-mono">{totalMensalContratos.toFixed(2)}â‚¬</h3>
                <p className="text-[10px] text-slate-400 mt-1">ServiÃ§os ativos recorrentes</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><i className="fa-solid fa-calendar-day"></i></div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide block">Encargo Anual Total</span>
                <h3 className="text-xl font-black text-slate-800 font-mono">{totalAnualContratos.toFixed(2)}â‚¬</h3>
                <p className="text-[10px] text-slate-400 mt-1">Soma de contratos do prÃ©dio</p>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg"><i className="fa-solid fa-calculator"></i></div>
            </div>

            {/* Live budget impact evaluation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center w-full">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wide block">Impacto no OrÃ§amento Geral</span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-0.5">{impactoOrcamentoContratos.toFixed(1)}%</h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Ref. OrÃ§amento Anual</span>
                  <div className="flex items-center justify-end space-x-1 mt-0.5 font-mono">
                    <input 
                      type="number"
                      value={orcamentoReferencia}
                      onChange={e => setOrcamentoReferencia(e.target.value)}
                      className="w-16 border border-slate-200 text-center font-bold rounded py-0.5 text-[10px] bg-slate-50 focus:outline-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500">â‚¬</span>
                  </div>
                </div>
              </div>

              {/* Progress bar representing consumption */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    impactoOrcamentoContratos > 50 
                      ? "bg-red-500" 
                      : impactoOrcamentoContratos > 25 
                      ? "bg-amber-500" 
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, impactoOrcamentoContratos)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form to archive new Contracted Service */}
          {(loggedUser.role === 'ADMIN' || loggedUser.role === 'EMPRESA_GESTORA') && (
            <form onSubmit={submeterContrato} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 no-print">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                  <i className="fa-solid fa-file-signature text-xs"></i>
                </span>
                <span>Arquivar Novo Contrato de PrestaÃ§Ã£o de ServiÃ§os</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Fornecedor Associado *</label>
                  <select
                    required
                    value={selectedFornecedorId}
                    onChange={e => setSelectedFornecedorId(e.target.value)}
                    className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-indigo-500 bg-white"
                  >
                    <option value="">-- Selecione o Parceiro --</option>
                    {predioForn.map(f => (
                      <option key={f.id_fornecedor} value={f.id_fornecedor}>{f.nome} ({f.categoria})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 mb-1">DescriÃ§Ã£o do ServiÃ§o Contratado *</label>
                  <input
                    type="text"
                    required
                    value={servicoNome}
                    onChange={e => setServicoNome(e.target.value)}
                    placeholder="Ex: Contrato de ManutenÃ§Ã£o Preventiva de Elevador Principal"
                    className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Custo Mensal (â‚¬) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={custoMensal}
                    onChange={e => handleCustoMensalChange(e.target.value)}
                    placeholder="Ex: 85.00"
                    className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Custo Anual (â‚¬)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={custoAnual}
                    onChange={e => handleCustoAnualChange(e.target.value)}
                    placeholder="Ex: 1020.00"
                    className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-500 mb-1">Fim de VigÃªncia / RenovaÃ§Ã£o</label>
                  <input
                    type="date"
                    required
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                    className="border border-slate-200 px-3 py-2 text-sm rounded-lg focus:outline-indigo-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 select-none pb-2.5">
                    <input
                      type="checkbox"
                      checked={renovacaoAuto}
                      onChange={e => setRenovacaoAuto(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span>RenovaÃ§Ã£o AutomÃ¡tica?</span>
                  </label>
                </div>
              </div>

              {/* PDF Contract Uploader */}
              <div className="flex flex-col pt-1">
                <label className="text-xs font-semibold text-slate-500 mb-1">Anexo / Arquivo Digital do Contrato (Opcional)</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("contract-file-selector")?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold border border-slate-250 cursor-pointer flex items-center space-x-1.5"
                  >
                    <i className="fa-solid fa-file-pdf text-red-600"></i>
                    <span>Selecionar Documento Contratual</span>
                  </button>
                  <input
                    id="contract-file-selector"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleContractFile}
                    className="hidden"
                  />
                  {documentoNome && (
                    <span className="text-xs text-slate-600 font-bold font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      âœ“ {documentoNome}
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer flex items-center space-x-2">
                <i className="fa-solid fa-check"></i>
                <span>Arquivar e Vincular Contrato</span>
              </button>
            </form>
          )}

          {/* List of active Contracted Services with warning indicators */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pasta Digital de Contratos de ServiÃ§os</h4>
            
            {predioContratos.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 italic text-xs">
                Nenhum contrato arquivado para este condomÃ­nio.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {predioContratos.map(c => {
                  const partner = fornecedores.find(f => f.id_fornecedor === c.id_fornecedor);
                  const isExpiring = isExpiringSoon(c.data_fim);
                  
                  return (
                    <div 
                      key={c.id_contrato} 
                      className={`bg-white p-5 rounded-xl border shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isExpiring 
                          ? "border-amber-400 bg-amber-50/20" 
                          : "border-slate-200"
                      }`}
                    >
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-xs font-black text-slate-800">{partner?.nome || "Parceiro do PrÃ©dio"}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                            {partner?.categoria || "ServiÃ§o Geral"}
                          </span>
                          {c.renovacao_automatica && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-1.5 py-0.5 rounded">
                              RenovaÃ§Ã£o Auto
                            </span>
                          )}
                          {isExpiring && (
                            <span className="text-[9px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full animate-bounce flex items-center space-x-1">
                              <i className="fa-solid fa-bell"></i>
                              <span>ALERTA DE RENOVAÃ‡ÃƒO EM CURSO</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-700">{c.servico}</h4>
                        <div className="flex space-x-4 text-[10px] text-slate-500 font-mono">
                          <span>Data Fim: <strong className={isExpiring ? "text-amber-700" : ""}>{c.data_fim}</strong></span>
                          <span>IBAN Fornecedor: <strong>{partner?.iban || "N/A"}</strong></span>
                        </div>
                      </div>

                      {/* Right financials & Contract archive buttons */}
                      <div className="flex items-center space-x-5 shrink-0 self-end md:self-auto">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Encargo de Contrato</span>
                          <span className="text-sm font-black text-slate-800 font-mono block">{c.custo_mensal.toFixed(2)}â‚¬ <span className="text-[10px] text-slate-400 font-medium">/mÃªs</span></span>
                          <span className="text-[10px] text-slate-500 font-mono block">({c.custo_anual.toFixed(2)}â‚¬ /ano)</span>
                        </div>

                        <div className="flex space-x-1.5">
                          {c.documento_nome && (
                            <a 
                              href={c.documento_base64 || "#"} 
                              download={c.documento_nome}
                              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                              title={`Download ${c.documento_nome}`}
                            >
                              <i className="fa-solid fa-download"></i>
                            </a>
                          )}
                          {loggedUser.role === 'ADMIN' && (
                            <button
                              onClick={() => excluirContrato(c.id_contrato)}
                              className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                              title="Arquivar Contrato"
                            >
                              <i className="fa-solid fa-box-archive"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}










