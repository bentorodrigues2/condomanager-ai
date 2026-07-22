import { Icon } from './Icon';
import React, { useState } from "react";
import { Predio, Fracao, Aviso, LoggedUser } from "../types";
import { formatDatePT } from "../utils";

interface ContenciosoJuridicoProps {
  predio: Predio;
  fracoes: Fracao[];
  avisos: Aviso[];
  loggedUser: LoggedUser;
}

export function ContenciosoJuridico({
  predio,
  fracoes,
  avisos,
  loggedUser
}: ContenciosoJuridicoProps) {
  const [activeTab, setActiveTab] = useState<"geral" | "cartasar" | "injuncÃµes" | "regulamento">("geral");
  const [selectedFracaoId, setSelectedFracaoId] = useState<string>("");
  const [interestRate, setInterestRate] = useState<number>(4.0); // Default 4% annual interest
  const [printedDoc, setPrintedDoc] = useState<boolean>(false);

  // Filter entities to current building
  const predioFracoes = fracoes.filter(f => f.id_predio === predio.id_predio);
  const predioAvisos = avisos.filter(a => a.id_predio === predio.id_predio);

  // Anchor date of the system is 2026-07-15
  const anchorDate = new Date("2026-07-15");

  // Calculate days overdue
  const getDaysOverdue = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    const diffTime = anchorDate.getTime() - due.getTime();
    if (diffTime <= 0) return 0;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine the legal status and metrics for each fraction
  const getLegalInfoForFracao = (fracId: string) => {
    const frAvisos = predioAvisos.filter(a => a.id_fracao === fracId && a.estado === "Pendente");
    const totalDebt = frAvisos.reduce((acc, curr) => acc + curr.valor, 0);
    
    let maxDaysOverdue = 0;
    let worstAvisoDate = "";

    frAvisos.forEach(a => {
      const overdue = getDaysOverdue(a.vencimento);
      if (overdue > maxDaysOverdue) {
        maxDaysOverdue = overdue;
        worstAvisoDate = a.vencimento;
      }
    });

    // Auto legal status rules:
    // Overdue > 60 days -> Contencioso (Litigation) -> Vote Inhibition
    // Overdue > 30 days -> PrÃ©-Contencioso
    // Overdue > 15 days -> Alerta / CobranÃ§a AmigÃ¡vel
    // Otherwise -> Regular
    let status = "Regular";
    let color = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40";
    let statusText = "Regularizado";
    let inibidoVoto = false;

    if (totalDebt > 0) {
      if (maxDaysOverdue > 60) {
        status = "Contencioso";
        color = "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40";
        statusText = "Contencioso (JurÃ­dico)";
        inibidoVoto = true;
      } else if (maxDaysOverdue > 30) {
        status = "Pre-Contencioso";
        color = "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40";
        statusText = "PrÃ©-Contencioso";
      } else {
        status = "Alerta";
        color = "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40";
        statusText = "Alerta / CobranÃ§a";
      }
    }

    return {
      totalDebt,
      maxDaysOverdue,
      worstAvisoDate,
      status,
      statusText,
      color,
      inibidoVoto,
      unpaidCount: frAvisos.length,
      unpaidAvisos: frAvisos
    };
  };

  const selectedFracao = predioFracoes.find(f => f.id_fracao === selectedFracaoId) || predioFracoes[0];
  const selectedFracaoInfo = selectedFracao ? getLegalInfoForFracao(selectedFracao.id_fracao) : null;

  // Count metrics for building summary cards
  const litigationFracoes = predioFracoes.map(f => ({
    frac: f,
    info: getLegalInfoForFracao(f.id_fracao)
  }));

  const totalBuildingDebt = litigationFracoes.reduce((acc, curr) => acc + curr.info.totalDebt, 0);
  const totalInlitigationCount = litigationFracoes.filter(x => x.info.status === "Contencioso").length;
  const totalInPreLitigationCount = litigationFracoes.filter(x => x.info.status === "Pre-Contencioso").length;
  const totalInhibitedVotersCount = litigationFracoes.filter(x => x.info.inibidoVoto).length;

  // Calculate simulated interest for Injunction Form
  const calculateInterestForAviso = (aviso: Aviso) => {
    const days = getDaysOverdue(aviso.vencimento);
    if (days <= 0) return 0;
    // Formula: (Value * Rate * Days) / (365 * 100)
    const int = (aviso.valor * (interestRate / 100) * days) / 365;
    return parseFloat(int.toFixed(2));
  };

  const getCalculatedTotalInterest = (unpaidList: Aviso[]) => {
    return unpaidList.reduce((acc, curr) => acc + calculateInterestForAviso(curr), 0);
  };

  const handlePrint = () => {
    setPrintedDoc(true);
    window.print();
    setTimeout(() => setPrintedDoc(false), 2000);
  };

  // 5. REGULAMENTO INTERNO AUTOMÃTICO COM BASE NO PATRIMÃ“NIO
  const renderRegulamentoInterno = () => {
    const pat = predio.patrimonio;
    return (
      <div className="bg-[#fcfbf9] dark:bg-[#1a1f2c] text-slate-900 dark:text-slate-200 p-8 rounded-xl border border-slate-300 dark:border-slate-800 shadow-md font-serif max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 border-b-2 border-slate-300 dark:border-slate-700 pb-5">
          <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-500">Regulamento Interno de CoabitaÃ§Ã£o</p>
          <h2 className="text-2xl font-bold tracking-tight font-serif text-slate-800 dark:text-white">CONDOMÃNIO DO EDIFÃCIO {predio.nome ? predio.nome.toUpperCase() : "SEM NOME"}</h2>
          <p className="text-xs text-slate-500 font-sans">{predio.morada_linha1}, {predio.num_porta} - NIF: {predio.nif}</p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 font-sans text-justify leading-relaxed italic border-l-4 border-slate-300 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded">
          PreÃ¢mbulo: O presente Regulamento Interno Ã© constituÃ­do e emitido automaticamente em conformidade com as caracterÃ­sticas fÃ­sicas e patrimoniais do edifÃ­cio registadas no cadastro tÃ©cnico da AdministraÃ§Ã£o em 2026. Tem forÃ§a jurÃ­dica interna e vincula todos os proprietÃ¡rios, inquilinos, usufrutuÃ¡rios e utilizadores ocasionais das fraÃ§Ãµes autÃ³nomas.
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-justify">
          <div className="space-y-1">
            <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 1.Âº - Objeto e Ã‚mbito</h4>
            <p>O presente regulamento disciplina o uso, a fruiÃ§Ã£o, a conservaÃ§Ã£o e a administraÃ§Ã£o das partes comuns do edifÃ­cio situado na {predio.morada_linha1}, {predio.localidade}. Aplica-se a todas as fraÃ§Ãµes autÃ³nomas ({predioFracoes.length} fraÃ§Ãµes cadastradas), garagens e Ã¡reas de arrumos anexas.</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 2.Âº - ObrigaÃ§Ãµes Financeiras e Quotas</h4>
            <p>1. Todos os condÃ³minos estÃ£o obrigados a concorrer para as despesas comuns em proporÃ§Ã£o da permilagem das respetivas fraÃ§Ãµes. Os pagamentos devem ser efetuados mensalmente atÃ© ao dia 15 de cada mÃªs correspondente.</p>
            <p>2. O atraso no pagamento das quotas por perÃ­odo superior a 30 dias constitui o condÃ³mino em mora, vencendo-se juros legais Ã  taxa anual de {interestRate}%. A mora superior a 60 dias despoleta aÃ§Ã£o executiva jurÃ­dica automÃ¡tica (InjunÃ§Ã£o Judicial) e inibiÃ§Ã£o imediata de voto nas assembleias.</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 3.Âº - Direitos e Deveres de CoabitaÃ§Ã£o</h4>
            <p>1. Ã‰ estritamente proibido produzir ruÃ­dos incÃ³modos ou realizar obras ruidosas entre as 20h00 e as 08h00 nos dias Ãºteis, e a qualquer hora nos fins de semana e feriados nacionais.</p>
            <p>2. Os animais domÃ©sticos devem circular nas escadas e halls comuns sempre com trela e acompanhados pelo respetivo tutor, sendo este civilmente responsÃ¡vel por qualquer sujidade ou dano causado.</p>
          </div>

          {/* DYNAMIC ELEVATOR ARTICLE */}
          {pat.tem_elevador && (
            <div className="space-y-1">
              <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 4.Âº - UtilizaÃ§Ã£o dos Equipamentos de Elevador ({pat.num_elevadores} unidades)</h4>
              <p>1. Atendendo a que o prÃ©dio estÃ¡ equipado com {pat.num_elevadores} elevador(es) mecÃ¢nico(s), Ã© expressamente proibido exceder o limite de carga expresso em cabine (seguranÃ§a regulamentar).</p>
              <p>2. As crianÃ§as com idade inferior a 6 anos nÃ£o devem utilizar o elevador desacompanhadas. Ã‰ vedado o transporte de objetos de grande porte que ponham em causa a integridade das paredes ou espelhos da cabine.</p>
            </div>
          )}

          {/* DYNAMIC GARAGE ARTICLE */}
          {pat.tem_garagem && (
            <div className="space-y-1">
              <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 5.Âº - Garagens e Parqueamento SubterrÃ¢neo</h4>
              <p>1. Os lugares de garagem destinam-se exclusivamente ao estacionamento de veÃ­culos automÃ³veis ou motociclos em perfeito estado de funcionamento.</p>
              <p>2. Ã‰ proibida a velocidade superior a 10 km/h no interior das rampas e garagens comuns, bem como a lavagem de viaturas, armazenamento de materiais inflamÃ¡veis ou obstruÃ§Ã£o de vias de evacuaÃ§Ã£o de seguranÃ§a.</p>
            </div>
          )}

          {/* DYNAMIC SWIMMING POOL ARTICLE */}
          {pat.tem_piscina && (
            <div className="space-y-1">
              <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 6.Âº - Piscina Comum do CondomÃ­nio</h4>
              <p>1. A piscina Ã© de uso exclusivo de condÃ³minos e respetivos familiares coabitantes. Recomenda-se a presenÃ§a mÃ¡xima de 2 convidados por fraÃ§Ã£o.</p>
              <p>2. Ã‰ obrigatÃ³ria a passagem pelo duche de higiene antes da entrada na Ã¡gua. Ã‰ proibido o uso de recipientes de vidro nas imediaÃ§Ãµes e jogos ruidosos ou perigosos na zona da piscina.</p>
            </div>
          )}

          {/* DYNAMIC GYM/SPA ARTICLE */}
          {(pat.tem_ginasio || pat.tem_spa) && (
            <div className="space-y-1">
              <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 7.Âº - Central Fitness (GinÃ¡sio & Spa)</h4>
              <p>1. Os espaÃ§os de bem-estar ({pat.tem_ginasio ? "GinÃ¡sio Comum" : ""} {pat.tem_spa ? "e Piscina & Spa" : ""}) destinam-se a moradores que tenham efetuado marcaÃ§Ã£o prÃ©via regulamentar no portal eletrÃ³nico.</p>
              <p>2. Cada utilizaÃ§Ã£o deve respeitar a lotaÃ§Ã£o mÃ¡xima parametrizada por razÃµes sanitÃ¡rias. Ã‰ obrigatÃ³rio o uso de toalha individual nos aparelhos e calÃ§ado limpo exclusivo para interior.</p>
            </div>
          )}

          {/* DYNAMIC COMMON LOUNGE / BBQ ARTICLE */}
          {(pat.tem_sala_comum || pat.tem_churrasqueira) && (
            <div className="space-y-1">
              <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 8.Âº - SalÃ£o de Festas & EspaÃ§o de Churrasqueira</h4>
              <p>1. A utilizaÃ§Ã£o do SalÃ£o de Festas e Churrasqueira requer agendamento prÃ©vio com cauÃ§Ã£o regulamentar, visando garantir a limpeza do espaÃ§o.</p>
              <p>2. O ruÃ­do deve cessar impreterivelmente Ã s 22h00. O lixo resultante do evento deve ser depositado nos ecopontos exteriores, deixando as grelhas e bancadas devidamente higienizadas.</p>
            </div>
          )}

          <div className="space-y-1">
            <h4 className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 font-sans text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Artigo 9.Âº - PenalizaÃ§Ãµes por Incumprimento</h4>
            <p>Qualquer violaÃ§Ã£o continuada Ã s regras aqui descritas confere Ã  AdministraÃ§Ã£o o direito de aplicar multas pecuniÃ¡rias sob deliberaÃ§Ã£o de Assembleia, correspondentes a atÃ© 3 vezes o valor da quota ordinÃ¡ria mensal da respetiva fraÃ§Ã£o autÃ³noma, sem prejuÃ­zo de indemnizaÃ§Ã£o civil por danos causados.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 font-sans space-y-1">
          <p>Aprovado por unanimidade jurÃ­dica em Assembleia Geral de CondÃ³minos.</p>
          <p>Assinado digitalmente pela AdministraÃ§Ã£o: {loggedUser.nome}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
            <i className="fa-solid fa-scale-balanced text-red-500 mr-2.5"></i>
            GestÃ£o Contenciosa & JurÃ­dica (RecuperaÃ§Ã£o de DÃ­vidas)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controlo automÃ¡tico do estado de cobranÃ§a de quotas, inibiÃ§Ã£o de direitos de voto, cartas de notificaÃ§Ã£o regulamentares e requerimentos de injunÃ§Ã£o civil.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("geral")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "geral"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-folder-open mr-1.5"></i> Resumo de Contencioso
          </button>
          <button
            onClick={() => {
              setActiveTab("cartasar");
              if (!selectedFracaoId && predioFracoes.length > 0) {
                // Select first with debt
                const firstWithDebt = predioFracoes.find(f => getLegalInfoForFracao(f.id_fracao).totalDebt > 0);
                if (firstWithDebt) setSelectedFracaoId(firstWithDebt.id_fracao);
                else setSelectedFracaoId(predioFracoes[0].id_fracao);
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "cartasar"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-envelope-open-text mr-1.5"></i> Carta de CobranÃ§a AR
          </button>
          <button
            onClick={() => {
              setActiveTab("injuncÃµes");
              if (!selectedFracaoId && predioFracoes.length > 0) {
                const firstWithDebt = predioFracoes.find(f => getLegalInfoForFracao(f.id_fracao).totalDebt > 0);
                if (firstWithDebt) setSelectedFracaoId(firstWithDebt.id_fracao);
                else setSelectedFracaoId(predioFracoes[0].id_fracao);
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "injuncÃµes"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-gavel mr-1.5"></i> InjunÃ§Ã£o Judicial
          </button>
          <button
            onClick={() => setActiveTab("regulamento")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "regulamento"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <i className="fa-solid fa-file-invoice mr-1.5"></i> Regulamento Interno
          </button>
        </div>
      </div>

      {/* --- Tab 1: Resumo Geral e Estados AutomÃ¡ticos --- */}
      {activeTab === "geral" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-euro-sign text-base"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">DÃ­vida Total Ativa</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono-custom">{totalBuildingDebt.toFixed(2)} â‚¬</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-gavel text-base"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Casos em Contencioso</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono-custom">{totalInlitigationCount} fraÃ§Ãµes</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-hourglass-half text-base"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">PrÃ©-Contencioso</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono-custom">{totalInPreLitigationCount} fraÃ§Ãµes</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-ban text-base"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Votos Inibidos</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono-custom">{totalInhibitedVotersCount} fraÃ§Ãµes</p>
              </div>
            </div>
          </div>

          {/* Automatic legal states lists */}
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-list-check text-red-500 mr-2"></i>
              Estados JurÃ­dicos e Risco de Incumprimento por FraÃ§Ã£o
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O sistema monitoriza os prazos de vencimento dos avisos emitidos. FraÃ§Ãµes com atrasos superiores a 30 dias entram em prÃ©-contencioso e superiores a 60 dias entram automaticamente em contencioso judicial com perda imediata de direitos de voto.
            </p>

            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-150 dark:border-slate-800">
                    <th className="p-3">FraÃ§Ã£o</th>
                    <th className="p-3">ProprietÃ¡rio / NIF</th>
                    <th className="p-3 text-center">Avisos em Falta</th>
                    <th className="p-3 text-center">Dias MÃ¡x. Atraso</th>
                    <th className="p-3 text-right">DÃ­vida Acumulada</th>
                    <th className="p-3 text-center">Estado JurÃ­dico</th>
                    <th className="p-3 text-center">InibiÃ§Ã£o Voto</th>
                    <th className="p-3 text-right">AÃ§Ã£o RÃ¡pida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {litigationFracoes.map(({ frac, info }) => (
                    <tr key={frac.id_fracao} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-300">
                      <td className="p-3 font-semibold">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono-custom">
                          FraÃ§Ã£o {frac.fracao_nome}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{frac.piso} - {frac.tipologia}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{frac.proprietario.nome}</p>
                        <p className="text-[10px] text-slate-400 font-mono-custom">NIF: {frac.proprietario.nif}</p>
                      </td>
                      <td className="p-3 text-center font-mono-custom font-semibold">
                        {info.unpaidCount > 0 ? (
                          <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                            {info.unpaidCount} docs
                          </span>
                        ) : (
                          <span className="text-emerald-600">0</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono-custom">
                        {info.maxDaysOverdue > 0 ? (
                          <span className="text-red-500 font-semibold">{info.maxDaysOverdue} dias</span>
                        ) : (
                          <span className="text-slate-400">Nenhum</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold font-mono-custom text-slate-900 dark:text-slate-100">
                        {info.totalDebt > 0 ? `${info.totalDebt.toFixed(2)} â‚¬` : "0.00 â‚¬"}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${info.color}`}>
                          {info.statusText}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {info.inibidoVoto ? (
                          <span className="text-[9px] font-extrabold uppercase bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-2 py-1 rounded animate-pulse border border-red-200">
                            <i className="fa-solid fa-ban mr-1"></i> Inibido
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            Autorizado
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {info.totalDebt > 0 ? (
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedFracaoId(frac.id_fracao);
                                setActiveTab("cartasar");
                              }}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold py-1 px-2 rounded cursor-pointer transition-colors"
                              title="Gerar NotificaÃ§Ã£o de CobranÃ§a Registada"
                            >
                              <i className="fa-solid fa-envelope-open-text"></i> Carta AR
                            </button>
                            {info.status === "Contencioso" && (
                              <button
                                onClick={() => {
                                  setSelectedFracaoId(frac.id_fracao);
                                  setActiveTab("injuncÃµes");
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1 px-2 rounded cursor-pointer transition-colors"
                                title="Gerar Requerimento Judicial de InjunÃ§Ã£o"
                              >
                                <i className="fa-solid fa-gavel"></i> InjunÃ§Ã£o
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Sem pendÃªncias</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Cartas AR de CobranÃ§a AmigÃ¡vel / PrÃ©-contenciosa --- */}
      {activeTab === "cartasar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-sliders text-red-500 mr-2"></i>
              ParÃ¢metros da Carta AR
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Selecionar FraÃ§Ã£o Devedora</label>
                <select
                  value={selectedFracaoId}
                  onChange={e => setSelectedFracaoId(e.target.value)}
                  className="mt-1 w-full border border-slate-200 dark:border-slate-800 p-2 text-xs rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                >
                  <option value="">-- Selecionar FraÃ§Ã£o --</option>
                  {predioFracoes.map(f => {
                    const info = getLegalInfoForFracao(f.id_fracao);
                    return (
                      <option key={f.id_fracao} value={f.id_fracao}>
                        FraÃ§Ã£o {f.fracao_nome} - {f.proprietario.nome} ({info.totalDebt.toFixed(2)} â‚¬)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Prazo para RegularizaÃ§Ã£o (Dias)</label>
                <select className="mt-1 w-full border border-slate-200 dark:border-slate-800 p-2 text-xs rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                  <option value="15">15 Dias Ãšteis (Recomendado)</option>
                  <option value="8">8 Dias de CalendÃ¡rio</option>
                  <option value="30">30 Dias Gerais</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Taxa de Juro de Mora Anual (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={interestRate}
                  onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full border border-slate-200 dark:border-slate-800 p-2 text-xs rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-mono-custom"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePrint}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>Imprimir / Exportar Carta AR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Letter preview */}
          <div className="lg:col-span-2">
            {!selectedFracaoId ? (
              <div className="bg-white dark:bg-[#0f172a] p-12 text-center text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                <i className="fa-regular fa-envelope-open text-4xl mb-3 text-slate-300"></i>
                <p className="text-xs">Por favor, selecione uma fraÃ§Ã£o devedora para gerar a notificaÃ§Ã£o jurÃ­dica oficial.</p>
              </div>
            ) : (
              <div className="bg-[#fcfbf9] text-slate-800 p-8 rounded-xl border border-slate-300 shadow-md font-serif text-justify text-xs leading-relaxed space-y-6">
                <div className="flex justify-between items-start font-sans">
                  <div>
                    <h4 className="font-extrabold uppercase text-[10px] text-slate-500 tracking-wider">CONDOMÃNIO DO EDIFÃCIO</h4>
                    <p className="text-sm font-bold text-slate-950 font-sans">{predio.nome || "Sem Nome"}</p>
                    <p className="text-[10px] text-slate-500 font-mono-custom">NIF: {predio.nif}</p>
                    <p className="text-[10px] text-slate-500">{predio.morada_linha1}, {predio.localidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 uppercase">CARTA REGISTADA COM AR</p>
                    <p className="text-[9px] text-slate-400">DATA: 15 de Julho de 2026</p>
                  </div>
                </div>

                <div className="font-sans border border-slate-300 p-4 rounded bg-slate-50 space-y-1 w-2/3 ml-auto text-xs leading-normal">
                  <p className="text-[10px] uppercase font-bold text-slate-400">DestinatÃ¡rio:</p>
                  <p className="font-bold text-slate-900">{selectedFracao.proprietario.nome}</p>
                  <p className="font-mono-custom">NIF: {selectedFracao.proprietario.nif}</p>
                  <p>FraÃ§Ã£o AutÃ³noma "{selectedFracao.fracao_nome}" - {selectedFracao.piso}</p>
                  <p>{predio.morada_linha1}, {predio.localidade}</p>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-slate-900 text-sm">Assunto: NotificaÃ§Ã£o de CobranÃ§a Extrajudicial de Quotas de CondomÃ­nio em Falta</p>

                  <p>Exmo.(a) Senhor(a) CondÃ³mino(a),</p>

                  <p>Na qualidade de AdministraÃ§Ã£o do CondomÃ­nio do EdifÃ­cio {predio.nome || "Sem Nome"}, em conformidade com as atribuiÃ§Ãµes legais conferidas pelo CÃ³digo Civil, entramos em contacto por este meio formal para expor e solicitar a V. Exa. a regularizaÃ§Ã£o urgente dos valores em dÃ­vida para com este condomÃ­nio, relativos Ã  fraÃ§Ã£o autÃ³noma designada pela letra <strong>"{selectedFracao.fracao_nome}"</strong>, correspondente ao {selectedFracao.piso} do qual Ã© legÃ­timo proprietÃ¡rio.</p>

                  <p>De acordo com os nossos registos contabilÃ­sticos e financeiros atualizados Ã  presente data (15-07-2026), encontram-se por liquidar os seguintes avisos e quotas do condomÃ­nio:</p>

                  <table className="w-full text-left font-sans text-[10px] border border-slate-300 rounded overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                        <th className="p-2">Documento</th>
                        <th className="p-2">DescriÃ§Ã£o</th>
                        <th className="p-2">Vencimento</th>
                        <th className="p-2 text-center">Dias Atraso</th>
                        <th className="p-2 text-right">Valor Inicial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedFracaoInfo?.unpaidAvisos.map(av => (
                        <tr key={av.id_aviso} className="text-slate-600">
                          <td className="p-2 font-mono-custom">{av.id_aviso}</td>
                          <td className="p-2">{av.descricao}</td>
                          <td className="p-2 font-mono-custom">{av.vencimento}</td>
                          <td className="p-2 text-center font-mono-custom font-semibold text-red-600">{getDaysOverdue(av.vencimento)} dias</td>
                          <td className="p-2 text-right font-mono-custom font-bold text-slate-900">{av.valor.toFixed(2)} â‚¬</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-300 text-slate-900">
                        <td colSpan={4} className="p-2 text-right uppercase tracking-wider text-[9px]">Total em DÃ­vida:</td>
                        <td className="p-2 text-right font-mono-custom text-red-600 text-xs">{selectedFracaoInfo?.totalDebt.toFixed(2)} â‚¬</td>
                      </tr>
                    </tbody>
                  </table>

                  <p>Mais se informa que ao abrigo do regulamento interno em vigor, e do CÃ³digo Civil, os valores em mora vencem juros de mora legais de <strong>{interestRate}% ao ano</strong> a contar do respetivo vencimento de cada prestaÃ§Ã£o.</p>

                  <p>Assim, serve a presente notificaÃ§Ã£o para interpelar V. Exa. a proceder Ã  liquidaÃ§Ã£o total da referida dÃ­vida no valor de <strong>{selectedFracaoInfo?.totalDebt.toFixed(2)} â‚¬</strong>, no prazo impreterÃ­vel de <strong>15 dias Ãºteis</strong> a contar da receÃ§Ã£o da presente carta, atravÃ©s dos canais habituais, Multibanco ou transferÃªncia para o IBAN do condomÃ­nio: <strong>{predioContasIBAN(predio.id_predio)}</strong>.</p>

                  <p>Caso se verifique o decurso do prazo indicado sem que o pagamento seja efetuado ou sem que nos seja apresentada uma proposta de plano de pagamento razoÃ¡vel, esta AdministraÃ§Ã£o ver-se-Ã¡ legalmente obrigada, nos termos do CÃ³digo Civil, a intentar uma aÃ§Ã£o judicial executiva de cobranÃ§a coerciva atravÃ©s do <strong>BalcÃ£o Nacional de InjunÃ§Ãµes (BNI)</strong>, servindo as atas de assembleia como tÃ­tulo executivo.</p>

                  <p>Adicionalmente, recordamos que a situaÃ§Ã£o de incumprimento superior a 60 dias implica a <strong>inibiÃ§Ã£o imediata e legal dos direitos de voto</strong> de V. Exa. em qualquer Assembleia Geral de CondÃ³minos nos termos do Regulamento Interno do EdifÃ­cio.</p>

                  <p>Com os melhores cumprimentos,</p>
                </div>

                <div className="pt-8 border-t border-slate-200 text-center font-sans text-[10px] text-slate-500">
                  <p>A AdministraÃ§Ã£o do CondomÃ­nio do EdifÃ­cio {predio.nome || "Sem Nome"}</p>
                  <p className="font-bold text-slate-700 mt-2">{loggedUser.nome}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab 3: Requerimento de InjunÃ§Ã£o Judicial ao BNI --- */}
      {activeTab === "injuncÃµes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings / Fee calculation */}
          <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-calculator text-red-500 mr-2"></i>
              Custas e Juros Judiciais
            </h3>

            {selectedFracaoInfo && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Selecionar RÃ©u (FraÃ§Ã£o)</label>
                  <select
                    value={selectedFracaoId}
                    onChange={e => setSelectedFracaoId(e.target.value)}
                    className="mt-1 w-full border border-slate-200 dark:border-slate-800 p-2 text-xs rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  >
                    {predioFracoes.map(f => {
                      const info = getLegalInfoForFracao(f.id_fracao);
                      return (
                        <option key={f.id_fracao} value={f.id_fracao}>
                          FraÃ§Ã£o {f.fracao_nome} - {f.proprietario.nome}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-2">
                  <div className="flex justify-between">
                    <span>Capital da DÃ­vida:</span>
                    <span className="font-bold font-mono-custom">{selectedFracaoInfo.totalDebt.toFixed(2)} â‚¬</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Juros de Mora ({interestRate}%):</span>
                    <span className="font-bold text-amber-500 font-mono-custom">
                      {getCalculatedTotalInterest(selectedFracaoInfo.unpaidAvisos).toFixed(2)} â‚¬
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de JustiÃ§a BNI:</span>
                    {/* Legal simulation fee: under â‚¬2000 is â‚¬25.50, above is â‚¬51.00 */}
                    <span className="font-bold text-red-500 font-mono-custom">
                      {selectedFracaoInfo.totalDebt <= 2000 ? "25.50" : "51.00"} â‚¬
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-bold text-sm text-slate-800 dark:text-white">
                    <span>Valor Total Reclamado:</span>
                    <span className="font-mono-custom">
                      {(
                        selectedFracaoInfo.totalDebt + 
                        getCalculatedTotalInterest(selectedFracaoInfo.unpaidAvisos) + 
                        (selectedFracaoInfo.totalDebt <= 2000 ? 25.50 : 51.00)
                      ).toFixed(2)} â‚¬
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal italic">
                  * O requerimento de injunÃ§Ã£o Ã© um processo cÃ©lere que confere forÃ§a executiva de tribunal (tÃ­tulo executivo judicial) para penhora imediata de contas bancÃ¡rias ou bens mÃ³veis do devedor caso este nÃ£o se oponha no prazo de 15 dias.
                </p>

                <button
                  onClick={handlePrint}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>Imprimir Requerimento Judicial</span>
                </button>
              </div>
            )}
          </div>

          {/* Court form preview */}
          <div className="lg:col-span-2">
            {!selectedFracaoId ? (
              <div className="bg-white dark:bg-[#0f172a] p-12 text-center text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                <p className="text-xs">Por favor, selecione uma fraÃ§Ã£o para formular o requerimento de injunÃ§Ã£o civil.</p>
              </div>
            ) : (
              <div className="bg-white text-slate-800 p-8 rounded-xl border border-slate-300 shadow-md font-sans text-[10px] leading-relaxed space-y-4">
                <div className="text-center space-y-1 border-b-2 border-slate-200 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-wider">BALCÃƒO NACIONAL DE INJUNÃ‡Ã•ES</h3>
                  <p className="text-xs uppercase font-semibold text-slate-500">Requerimento de InjunÃ§Ã£o - Decreto-Lei n.Âº 269/98</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 bg-slate-50 rounded">
                  <div>
                    <h5 className="font-extrabold uppercase text-[9px] text-slate-500">1. Requerente (Credor)</h5>
                    <p className="font-bold text-slate-900">CONDOMÃNIO DO EDIFÃCIO {predio.nome ? predio.nome.toUpperCase() : "SEM NOME"}</p>
                    <p>Contribuinte NIF: <strong>{predio.nif}</strong></p>
                    <p>Morada: {predio.morada_linha1}, {predio.localidade}</p>
                    <p>Representante: {loggedUser.nome}</p>
                  </div>
                  <div>
                    <h5 className="font-extrabold uppercase text-[9px] text-slate-500">2. Requerido (Devedor / RÃ©u)</h5>
                    <p className="font-bold text-slate-900">{selectedFracao.proprietario.nome}</p>
                    <p>Contribuinte NIF: <strong>{selectedFracao.proprietario.nif}</strong></p>
                    <p>Morada: {predio.morada_linha1}, FraÃ§Ã£o {selectedFracao.fracao_nome}, {predio.localidade}</p>
                    <p>Contacto tlm: {selectedFracao.proprietario.tlm}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold uppercase tracking-wide border-b border-slate-200 pb-0.5 text-slate-700 text-[11px]">3. Pedido LÃ­quido Discriminado</h5>
                  <div className="grid grid-cols-4 gap-2 text-center p-2 bg-slate-50 border rounded font-mono-custom text-xs font-bold">
                    <div className="border-r">
                      <p className="text-[9px] font-sans text-slate-400 uppercase">Capital Inicial</p>
                      <p className="text-slate-800">{selectedFracaoInfo?.totalDebt.toFixed(2)} â‚¬</p>
                    </div>
                    <div className="border-r">
                      <p className="text-[9px] font-sans text-slate-400 uppercase">Juros de Mora</p>
                      <p className="text-amber-600">{getCalculatedTotalInterest(selectedFracaoInfo?.unpaidAvisos || []).toFixed(2)} â‚¬</p>
                    </div>
                    <div className="border-r">
                      <p className="text-[9px] font-sans text-slate-400 uppercase">Taxa de JustiÃ§a</p>
                      <p className="text-red-600">{(selectedFracaoInfo?.totalDebt || 0) <= 2000 ? "25.50" : "51.00"} â‚¬</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-sans text-slate-400 uppercase">Valor do Pedido</p>
                      <p className="text-slate-950 font-extrabold">
                        {(
                          (selectedFracaoInfo?.totalDebt || 0) + 
                          getCalculatedTotalInterest(selectedFracaoInfo?.unpaidAvisos || []) + 
                          ((selectedFracaoInfo?.totalDebt || 0) <= 2000 ? 25.50 : 51.00)
                        ).toFixed(2)} â‚¬
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold uppercase tracking-wide border-b border-slate-200 pb-0.5 text-slate-700 text-[11px]">4. ExposiÃ§Ã£o dos Factos Fundamentadores</h5>
                  <div className="bg-slate-50 p-3 rounded text-justify space-y-2 border font-mono-custom text-[9px] leading-relaxed">
                    <p>1. O Requerente Ã© o CondomÃ­nio do EdifÃ­cio {predio.nome || "Sem Nome"}, regularmente constituÃ­do ao abrigo do regime jurÃ­dico da propriedade horizontal.</p>
                    <p>2. O Requerido Ã© proprietÃ¡rio da fraÃ§Ã£o autÃ³noma designada pela letra "{selectedFracao.fracao_nome}" correspondente ao {selectedFracao.piso} do referido edifÃ­cio, estando legalmente obrigado a concorrer para o pagamento das despesas comuns aprovadas em Assembleia Geral.</p>
                    <p>3. O Requerido encontra-se em mora relativamente ao pagamento de {selectedFracaoInfo?.unpaidCount} aviso(s) e cota(s) de condomÃ­nio devidamente emitidos, com prazos de vencimento jÃ¡ largamente ultrapassados, totalizando uma dÃ­vida lÃ­quida de capital em mora de {selectedFracaoInfo?.totalDebt.toFixed(2)} â‚¬.</p>
                    <p>4. Em conformidade com o Artigo 1431Âº e seguintes do CÃ³digo Civil, os devedores foram regularmente interpelados pela AdministraÃ§Ã£o atravÃ©s de correio registado, mantendo-se a situaÃ§Ã£o de incumprimento e omissÃ£o de pagamento voluntÃ¡rio atÃ© Ã  presente data.</p>
                    <p>5. O Requerente reclama juros legais calculados Ã  taxa de {interestRate}% ao ano sobre o capital vencido, computando presentemente {getCalculatedTotalInterest(selectedFracaoInfo?.unpaidAvisos || []).toFixed(2)} â‚¬ de juros, e a taxa de justiÃ§a de injunÃ§Ã£o correspondente ao valor da aÃ§Ã£o.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-500 font-sans">
                  <span>Assinatura EletrÃ³nica do MandatÃ¡rio / Administrador</span>
                  <span className="font-bold text-slate-700">{loggedUser.nome}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab 4: Regulamento Interno AutomÃ¡tico --- */}
      {activeTab === "regulamento" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-lg">
              Regulamento interno gerado dinamicamente com base nas caracterÃ­sticas de patrimÃ³nio tÃ©cnico cadastradas para o prÃ©dio ativo. Configurado para regular elevadores, piscina, ginÃ¡sio, spa e garagens comunitÃ¡rias.
            </p>
            <button
              onClick={handlePrint}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors cursor-pointer flex items-center space-x-2 shadow shrink-0"
            >
              <i className="fa-solid fa-print"></i>
              <span>Imprimir Regulamento</span>
            </button>
          </div>
          {renderRegulamentoInterno()}
        </div>
      )}
    </div>
  );

  // Helper local function to retrieve Bank Accounts IBAN to avoid crash
  function predioContasIBAN(predioId: string): string {
    // Return a dummy IBAN or search
    return "PT50 0018 2222 3333 4444 5555 6";
  }
}










