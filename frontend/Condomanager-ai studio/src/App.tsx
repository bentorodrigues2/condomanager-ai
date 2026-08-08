import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { LoggedUser, Predio, Conta, Fornecedor, Fracao, Aviso, Movimento, Reuniao, Documento, Ocorrencia, Reserva, CapacidadeLimite } from "./types";
import { initialPredios, initialContas, initialFornecedores, initialFracoes, initialAvisos, initialMovements, initialReunioes, initialDocumentos, initialOcorrencias } from "./data";
import { PainelControlo } from "./components/PainelControlo";
import { GestaoPredios } from "./components/GestaoPredios";
import { GestaoFracoes } from "./components/GestaoFracoes";
import { GestaoFornecedores } from "./components/GestaoFornecedores";
import { GestaoContas } from "./components/GestaoContas";
import { GestaoEmissao } from "./components/GestaoEmissao";
import { GestaoMovimentos } from "./components/GestaoMovimentos";
import { IAConciliacao } from "./components/IAConciliacao";
import { GestaoAssembleias } from "./components/GestaoAssembleias";
import { GestaoDocumentos } from "./components/GestaoDocumentos";
import { GestaoVistoriasLimpezas } from "./components/GestaoVistoriasLimpezas";
import { IAAvancada } from "./components/IAAvancada";
import { AssistenteImportacao } from "./components/AssistenteImportacao";
import { GestaoReservas } from "./components/GestaoReservas";
import { PortalCondomino } from "./components/PortalCondomino";
import { ContenciosoJuridico } from "./components/ContenciosoJuridico";
import { FinanceiroAvancado } from "./components/FinanceiroAvancado";
import { PortalOrcamentos } from "./components/PortalOrcamentos";
import { DashboardKPIs } from "./components/DashboardKPIs";
import { MultiCondominio } from "./components/MultiCondominio";
import { PWASimulator } from "./components/PWASimulator";
import { FichaEmpresaGestora } from "./components/FichaEmpresaGestora";
import { UserSecurityModal } from "./components/UserSecurityModal";
import { GestaoFundoReserva } from "./components/GestaoFundoReserva";
import { GestaoRelatorios } from "./components/GestaoRelatorios";
import { ContabilidadeInterna } from "./components/ContabilidadeInterna";
import { AuditoriaInterna } from "./components/AuditoriaInterna";
import { GestaoManutencaoIntervencoes } from "./components/GestaoManutencaoIntervencoes";
import { ConfiguracoesAdministracao } from "./components/ConfiguracoesAdministracao";
import { InventarioTecnico } from "./components/InventarioTecnico";
import { SecurityAuditModal } from "./components/SecurityAuditModal";
import { validatePasswordPolicy, createSecurityLog, INITIAL_USER_SECURITY, UserSecurityState } from "./lib/authSecurity";
import { 
  createNewSession, 
  validateSession, 
  purgeSession, 
  rotateSessionToken, 
  invalidateUserSessions, 
  validateRoleAccess,
  RoleNavigationMap,
  UserRole,
  IDLE_TIMEOUT_MS
} from "./lib/sessionManager";
// @ts-ignore
import condoManagerLogo from "./assets/images/condomanager_logo.png";
// @ts-ignore
import logoutIcon from "./assets/images/logout.png";
// @ts-ignore
import terminarSessaoIcon from "./assets/images/terminar-sessao.png";

export default function App() {
  const [predios, setPredios] = useState<Predio[]>(initialPredios);
  const [activePredioId, setActivePredioId] = useState("predio-1");
  const [contas, setContas] = useState<Conta[]>(initialContas);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(initialFornecedores);
  const [fracoes, setFracoes] = useState<Fracao[]>(initialFracoes);
  const [avisos, setAvisos] = useState<Aviso[]>(initialAvisos);
  const [movements, setMovements] = useState<Movimento[]>(initialMovements);
  const [reunioes, setReunioes] = useState<Reuniao[]>(initialReunioes);
  const [documentos, setDocumentos] = useState<Documento[]>(initialDocumentos);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(initialOcorrencias);

  // Reservation states
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id_reserva: "res-1",
      id_predio: "predio-1",
      id_fracao: "frac-1",
      area_comum: "Ginásio",
      data: "18-07-2026",
      hora_inicio: "08:00",
      hora_fim: "09:30",
      responsavel: "Carlos Administrador",
      num_pessoas: 2
    },
    {
      id_reserva: "res-2",
      id_predio: "predio-1",
      id_fracao: "frac-2",
      area_comum: "Spa",
      data: "18-07-2026",
      hora_inicio: "10:00",
      hora_fim: "12:00",
      responsavel: "Ana Silva",
      num_pessoas: 3
    }
  ]);

  const [capacidades, setCapacidades] = useState<CapacidadeLimite[]>([
    { area_comum: "Ginásio", limite: 5 },
    { area_comum: "Spa", limite: 8 },
    { area_comum: "Salão de Festas", limite: 40 },
    { area_comum: "Churrasqueira", limite: 15 }
  ]);

  const [loggedUser, setLoggedUser] = useState<LoggedUser>({
    nome: "Carlos Administrador",
    email: "carlos.adm@condomanager.pt",
    role: "ADMIN"
  });

  const [browserIsLoggedOut, setBrowserIsLoggedOut] = useState<boolean>(true);
  const [browserEmail, setBrowserEmail] = useState<string>("carlos.adm@condomanager.pt");
  const [browserPassword, setBrowserPassword] = useState<string>("••••••••");
  const [browserSelectedRole, setBrowserSelectedRole] = useState<LoggedUser["role"]>("ADMIN");
  const [browserBiometricScan, setBrowserBiometricScan] = useState<boolean>(false);
  const [browserBiometricProgress, setBrowserBiometricProgress] = useState<number>(0);
  const [browserResetMode, setBrowserResetMode] = useState<boolean>(false);
  const [browserResetSent, setBrowserResetSent] = useState<boolean>(false);
  const [securityModalOpen, setSecurityModalOpen] = useState<boolean>(false);
  const [newResetPassword, setNewResetPassword] = useState<string>("");
  const [confirmResetPassword, setConfirmResetPassword] = useState<string>("");
  const [userSecurityMap, setUserSecurityMap] = useState<Record<string, UserSecurityState>>(INITIAL_USER_SECURITY);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Cooldown countdown timer effect
  useEffect(() => {
    const currentSecState = userSecurityMap[browserEmail] || {
      email: browserEmail,
      failedAttempts: 0,
      cooldownUntil: null,
      cooldownPassed: false,
      postCooldownAttempts: 0,
      isLocked: false,
      mustResetPassword: false,
      passwordHistory: [],
      botChallengeRequired: false,
    };

    if (currentSecState.cooldownUntil && currentSecState.cooldownUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((currentSecState.cooldownUntil! - Date.now()) / 1000));
        setCooldownSeconds(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          // Transition to cooldownPassed = true
          setUserSecurityMap(prev => ({
            ...prev,
            [browserEmail]: {
              ...prev[browserEmail],
              cooldownUntil: null,
              cooldownPassed: true,
            }
          }));
          createSecurityLog(browserEmail, "BOT_CHALLENGE_PASSED", "Cooldown de 1 minuto terminado. Concedidas 3 tentativas pós-bloqueio.");
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCooldownSeconds(0);
    }
  }, [browserEmail, userSecurityMap]);

  // Automatic Theme detection via prefers-color-scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: any) => {
      setTheme(e.matches ? "dark" : "light");
    };

    setTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  // Update HTML class when theme state changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const [activeSection, setActiveSection] = useState("painel"); 
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [openMenuFracoes, setOpenMenuFracoes] = useState(true);
  const [openMenuFinanceiro, setOpenMenuFinanceiro] = useState(true);
  const [openMenuLimpezas, setOpenMenuLimpezas] = useState(true);
  const [openMenuVistoriasIntervencoes, setOpenMenuVistoriasIntervencoes] = useState(true);
  const [openMenuJuridico, setOpenMenuJuridico] = useState(true);
  const [openMenuComunicacoes, setOpenMenuComunicacoes] = useState(true);
  const [iaInitialTab, setIaInitialTab] = useState<"juridico" | "fundo_reserva" | "orcamentos" | "orcamento_anual_ia" | "cerebro_ia" | "comunicacoes_adenda" | undefined>(undefined); 
  const [viewMode, setViewMode] = useState<"BROWSER" | "PWA">("BROWSER");
  const [brandingColor, setBrandingColor] = useState<string>("emerald");
  const [whiteLabelLogo, setWhiteLabelLogo] = useState<string>(() => {
    return localStorage.getItem("whiteLabelLogo") || "";
  });

  // --------------------------------------------------------------------------
  // SESSION MANAGEMENT: IDLE TIMEOUT (30 MIN), HIJACKING & ROLE GUARD
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!loggedUser) return;

    // A. Role Navigation Guard
    const roleAccess = validateRoleAccess(loggedUser.role as UserRole, activeSection);
    if (!roleAccess.allowed) {
      console.warn(`[RoleGuard] Acesso negado à secção '${activeSection}' para a função '${loggedUser.role}'. Redirecionando para '${roleAccess.redirectTab}'.`);
      setActiveSection(roleAccess.redirectTab);
    }

    // B. Idle Activity Tracker (30-min timeout listener)
    const handleUserInteraction = () => {
      const val = validateSession(loggedUser.email, loggedUser.role as UserRole);
      if (!val.valid && val.shouldLogout) {
        handleSecureLogout(val.reason);
      }
    };

    window.addEventListener("mousemove", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });

    // C. Periodic Session Check & Token Rotation (Session Fixation Protection)
    const sessionInterval = setInterval(() => {
      const val = validateSession(loggedUser.email, loggedUser.role as UserRole);
      if (!val.valid) {
        handleSecureLogout(val.reason || "Sessão expirada.");
      }
    }, 60000); // check every 1 minute

    // D. Cross-Tab Logout Listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "condomanager_active_session" && !e.newValue) {
        handleSecureLogout("Sessão encerrada noutro separador.");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(sessionInterval);
    };
  }, [loggedUser, activeSection]);

  const handleSecureLogout = (reason?: string) => {
    purgeSession();
    setLoggedUser(null);
    setBrowserIsLoggedOut(true);
    if (reason) {
      setLoginErrorMessage(`ℹ️ ${reason}`);
    } else {
      setLoginErrorMessage("Sessão encerrada com sucesso.");
    }
  };

  const getColorClasses = (type: "bg" | "text" | "border" | "hoverBg" | "hoverText" | "bgLight") => {
    switch (brandingColor) {
      case "indigo":
        if (type === "bg") return "bg-indigo-600";
        if (type === "text") return "text-indigo-400";
        if (type === "border") return "border-indigo-600";
        if (type === "hoverBg") return "hover:bg-indigo-850";
        if (type === "hoverText") return "hover:text-indigo-400";
        if (type === "bgLight") return "bg-indigo-500/10";
        return "indigo";
      case "blue":
        if (type === "bg") return "bg-blue-600";
        if (type === "text") return "text-blue-400";
        if (type === "border") return "border-blue-600";
        if (type === "hoverBg") return "hover:bg-blue-800";
        if (type === "hoverText") return "hover:text-blue-400";
        if (type === "bgLight") return "bg-blue-500/10";
        return "blue";
      case "violet":
        if (type === "bg") return "bg-violet-600";
        if (type === "text") return "text-violet-400";
        if (type === "border") return "border-violet-600";
        if (type === "hoverBg") return "hover:bg-violet-800";
        if (type === "hoverText") return "hover:text-violet-400";
        if (type === "bgLight") return "bg-violet-500/10";
        return "violet";
      case "teal":
        if (type === "bg") return "bg-teal-600";
        if (type === "text") return "text-teal-400";
        if (type === "border") return "border-teal-600";
        if (type === "hoverBg") return "hover:bg-teal-850";
        if (type === "hoverText") return "hover:text-teal-400";
        if (type === "bgLight") return "bg-teal-500/10";
        return "teal";
      case "emerald":
      default:
        if (type === "bg") return "bg-emerald-500";
        if (type === "text") return "text-emerald-400";
        if (type === "border") return "border-emerald-500";
        if (type === "hoverBg") return "hover:bg-emerald-700";
        if (type === "hoverText") return "hover:text-emerald-400";
        if (type === "bgLight") return "bg-emerald-500/10";
        return "emerald";
    }
  };

  const handleProfileChange = (role: LoggedUser["role"]) => {
    let email = "carlos.adm@condomanager.pt";
    let nome = "Carlos Administrador";
    let section = "painel";

    if (role === "EMPRESA_GESTORA") {
      email = "contacto@gestaoforte.pt";
      nome = "Gestão Forte Administrações";
      section = "ficha_gestora";
    } else if (role === "USER") {
      email = "ana.silva@gmail.com";
      nome = "Ana Silva (Fração A)";
      section = "portal_condomino";
    } else if (role === "TECNICO") {
      email = "rui.melo@vistoriasegura.pt";
      nome = "Eng. Rui Melo";
      section = "manutencao_ocorrencias";
    } else if (role === "LIMPEZAS") {
      email = "maria.silva@limpezasestrela.pt";
      nome = "Maria Silva (Limpezas)";
      section = "vistorias_limpezas";
    } else if (role === "JURIDICO") {
      email = "dra.margarida@legalcondo.pt";
      nome = "Dra. Margarida Castro (Jurídico)";
      section = "contencioso_juridico";
    } else if (role === "AUDITOR") {
      email = "antonio.auditor@auditchain.pt";
      nome = "Dr. António Melo (Auditor)";
      section = "auditoria_interna";
    } else if (role === "CONTABILISTA") {
      email = "paula.contas@tcontabilidade.pt";
      nome = "Dra. Paula Silva (Contabilista)";
      section = "movimentos";
    }

    setLoggedUser({ role, email, nome });
    setActiveSection(section);
    setViewMode("BROWSER");
  }; 
  const [sidebarExpanded, setSidebarExpanded] = useState({
    administracao: true,
    operacoes: true,
    financeiro: true,
    condomino: true,
    documentacao: true,
    juridico: true,
    manutencao: true
  });

  const predioAtivo = predios.find(p => p.id_predio === activePredioId) || predios[0];

  const toggleSidebarSub = (menu: "administracao" | "operacoes" | "financeiro" | "condomino" | "documentacao" | "juridico" | "manutencao") => {
    setSidebarExpanded(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleAddPredio = (novoPredio: Predio) => {
    setPredios([...predios, novoPredio]);
    setActivePredioId(novoPredio.id_predio);
  };

  const handleImportGlobalData = (predioData: Predio, fracoesData: Fracao[], avisosData: Aviso[]) => {
    setPredios(prev => [...prev, predioData]);
    setFracoes(prev => [...prev, ...fracoesData]);
    setAvisos(prev => [...prev, ...avisosData]);
    setActivePredioId(predioData.id_predio);
    setActiveSection("painel"); // Redirect to Dashboard of newly imported building!
  };

  const handleUpdatePredio = (updatedPredio: Predio) => {
    setPredios(predios.map(p => p.id_predio === updatedPredio.id_predio ? updatedPredio : p));
  };

  const handleDeletePredio = (idPredio: string) => {
    if (predios.length <= 1) {
      alert("Não é possível remover o único prédio cadastrado no sistema.");
      return;
    }
    const filtered = predios.filter(p => p.id_predio !== idPredio);
    setPredios(filtered);
    if (activePredioId === idPredio) {
      setActivePredioId(filtered[0].id_predio);
    }
  };

  const handleAddFracao = (novaFracao: Fracao) => {
    setFracoes([...fracoes, novaFracao]);
  };

  const handleUpdateFracoes = (updatedFracoes: Fracao[]) => {
    setFracoes(updatedFracoes);
  };

  const handleAddFornecedor = (novoFornecedor: Fornecedor) => {
    setFornecedores([...fornecedores, novoFornecedor]);
  };

  const handleAddConta = (novaConta: Conta) => {
    let updatedContas = contas.map(c => {
      if (novaConta.is_principal && c.id_predio === novaConta.id_predio) {
        return { ...c, is_principal: false };
      }
      return c;
    });
    // If no other accounts exist for this building, default this first one to principal
    const hasOther = contas.some(c => c.id_predio === novaConta.id_predio);
    if (!hasOther) {
      novaConta.is_principal = true;
    }
    setContas([...updatedContas, novaConta]);
  };

  const handleSetPrincipalConta = (idConta: string) => {
    setContas(contas.map(c => {
      if (c.id_predio === activePredioId) {
        return { ...c, is_principal: c.id_conta === idConta };
      }
      return c;
    }));
  };

  const handleAddReuniao = (novaReuniao: Reuniao) => {
    setReunioes([...reunioes, novaReuniao]);
  };

  const handleAddOcorrencia = (novaOcorrencia: Ocorrencia) => {
    setOcorrencias([novaOcorrencia, ...ocorrencias]);
    // Alarm notification to internal administrators
    const adms = fracoes.filter(f => f.id_predio === activePredioId && f.administrador_interno === "Sim");
    adms.forEach(adm => {
      console.log(`[Alerta Push & E-mail] Enviado para Administrador Interno: ${adm.proprietario.nome} (${adm.proprietario.email}) - Nova ocorrência registada.`);
    });
    alert(`Alerta PWA disparado! Os Administradores Internos foram notificados por E-mail e Push sobre esta nova ocorrência.`);
  };

  const handleAddDocumento = (novoDoc: Documento) => {
    setDocumentos([novoDoc, ...documentos]);
  };

  const handleToggleUserRole = () => {
    handleProfileChange(loggedUser.role === "ADMIN" ? "USER" : "ADMIN");
  };

  if (browserIsLoggedOut) {
    const handleBrowserRoleChange = (role: LoggedUser["role"]) => {
      setBrowserSelectedRole(role);
      let email = "carlos.adm@condomanager.pt";
      if (role === "ADMIN") email = "carlos.adm@condomanager.pt";
      else if (role === "EMPRESA_GESTORA") email = "geral@gestaoforte.pt";
      else if (role === "USER") email = "ana.silva@gmail.com";
      else if (role === "TECNICO") email = "rui.melo@vistoriasegura.pt";
      else if (role === "LIMPEZAS") email = "limpezas.geral@cleancondo.pt";
      else if (role === "JURIDICO") email = "margarida.adv@contencioso.pt";
      else if (role === "AUDITOR") email = "antonio.auditor@auditoria.pt";
      else if (role === "CONTABILISTA") email = "paula.contas@contabilidade.pt";
      setBrowserEmail(email);
      setLoginErrorMessage("");
    };

    const userSec = userSecurityMap[browserEmail] || {
      email: browserEmail,
      failedAttempts: 0,
      cooldownUntil: null,
      cooldownPassed: false,
      postCooldownAttempts: 0,
      isLocked: false,
      mustResetPassword: false,
      passwordHistory: ["OldPass12345!", "PassCarlos2025!"],
      botChallengeRequired: false,
    };

    const handleAuthenticateBrowser = (role: LoggedUser["role"], forceSuccess: boolean = false) => {
      // 1. Check permanent brute-force lock
      if (userSec.isLocked) {
        setLoginErrorMessage("⚠️ Esta conta está BLOQUEADA por motivo de segurança. É obrigatório redefinir a palavra-passe para desbloquear.");
        setBrowserResetMode(true);
        return;
      }

      // 2. Check 1-minute cooldown
      if (userSec.cooldownUntil && userSec.cooldownUntil > Date.now()) {
        const remaining = Math.ceil((userSec.cooldownUntil - Date.now()) / 1000);
        setLoginErrorMessage(`🔒 Demasiadas tentativas falhadas. Login temporariamente bloqueado por ${remaining}s.`);
        return;
      }

      // If user enters wrong password or simulates wrong pass
      if (!forceSuccess && (browserPassword === "errada" || browserPassword === "123456")) {
        handleFailedAttempt();
        return;
      }

      // SUCCESS LOGIN: Reset counter
      createSecurityLog(browserEmail, "LOGIN_SUCCESS", `Login efetuado com sucesso no perfil ${role}. IP auditado e verificado.`);
      setUserSecurityMap(prev => ({
        ...prev,
        [browserEmail]: {
          ...userSec,
          failedAttempts: 0,
          cooldownUntil: null,
          cooldownPassed: false,
          postCooldownAttempts: 0,
          isLocked: false,
          mustResetPassword: false,
        }
      }));

      let nome = "Carlos Administrador";
      let email = browserEmail;
      if (role === "ADMIN") { nome = "Carlos Administrador"; email = "carlos.adm@condomanager.pt"; }
      else if (role === "EMPRESA_GESTORA") { nome = "Gestão Forte, Lda"; email = "geral@gestaoforte.pt"; }
      else if (role === "USER") { nome = "Ana Silva (Fração A)"; email = "ana.silva@gmail.com"; }
      else if (role === "TECNICO") { nome = "Eng. Rui Melo"; email = "rui.melo@vistoriasegura.pt"; }
      else if (role === "LIMPEZAS") { nome = "Maria Silva (Limpezas)"; email = "limpezas.geral@cleancondo.pt"; }
      else if (role === "JURIDICO") { nome = "Dra. Margarida Castro"; email = "margarida.adv@contencioso.pt"; }
      else if (role === "AUDITOR") { nome = "Dr. António Melo"; email = "antonio.auditor@auditoria.pt"; }
      else if (role === "CONTABILISTA") { nome = "Dra. Paula Silva"; email = "paula.contas@contabilidade.pt"; }

      setLoggedUser({ role, email, nome });
      setBrowserIsLoggedOut(false);
      setLoginErrorMessage("");

      // Create Session Token & Anti Fixation Protection
      createNewSession(email, (role as UserRole) || "USER", activePredioId);

      // Auto Redirect to Role Default Dashboard
      const roleConfig = RoleNavigationMap[(role as UserRole)] || RoleNavigationMap.USER;
      setActiveSection(roleConfig.defaultTab);
    };

    const handleFailedAttempt = () => {
      // If we already passed cooldown and are in the 3 post-cooldown attempts phase
      if (userSec.cooldownPassed) {
        const nextPostCount = userSec.postCooldownAttempts + 1;
        createSecurityLog(browserEmail, "LOGIN_FAILED", `Tentativa de login falhada pós-cooldown (${nextPostCount}/3).`);

        if (nextPostCount >= 3) {
          // Permanently lock account & trigger recovery email
          setUserSecurityMap(prev => ({
            ...prev,
            [browserEmail]: {
              ...userSec,
              postCooldownAttempts: nextPostCount,
              isLocked: true,
              mustResetPassword: true,
            }
          }));
          createSecurityLog(browserEmail, "ACCOUNT_LOCKED_BRUTE_FORCE", "Conta BLOQUEADA por brute force após 3 falhas pós-cooldown. E-mail automático de recuperação e redefinição disparado!");
          setLoginErrorMessage("🛑 CONTA BLOQUEADA: As 3 tentativas pós-cooldown falharam! Requer redefinição obrigatória de palavra-passe.");
          setBrowserResetMode(true);
          setBrowserResetSent(true);
        } else {
          setUserSecurityMap(prev => ({
            ...prev,
            [browserEmail]: {
              ...userSec,
              postCooldownAttempts: nextPostCount,
            }
          }));
          setLoginErrorMessage(`❌ Palavra-passe incorreta. Tentativa pós-cooldown ${nextPostCount} de 3 antes do bloqueio permanente da conta.`);
        }
        return;
      }

      // Initial 5 failed attempts phase
      const nextFailed = userSec.failedAttempts + 1;
      createSecurityLog(browserEmail, "LOGIN_FAILED", `Tentativa de login falhada (${nextFailed}/5).`);

      if (nextFailed >= 5) {
        const cooldownMs = Date.now() + 60000;
        setUserSecurityMap(prev => ({
          ...prev,
          [browserEmail]: {
            ...userSec,
            failedAttempts: nextFailed,
            cooldownUntil: cooldownMs,
          }
        }));
        createSecurityLog(browserEmail, "COOLDOWN_ACTIVATED", "5 tentativas consecutivas falhadas. Bloqueio de 1 minuto ativado com proteção contra Bots.");
        setLoginErrorMessage("🔒 5 tentativas falhadas consecutivas! Login temporariamente suspenso por 1 minuto.");
      } else {
        setUserSecurityMap(prev => ({
          ...prev,
          [browserEmail]: {
            ...userSec,
            failedAttempts: nextFailed,
          }
        }));
        setLoginErrorMessage(`❌ Palavra-passe incorreta. Tentativa falhada ${nextFailed} de 5 antes do bloqueio de 1 minuto.`);
      }
    };

    const handlePerformResetWithPolicy = () => {
      if (!newResetPassword || !confirmResetPassword) {
        alert("Por favor preencha a nova palavra-passe e a confirmação.");
        return;
      }
      if (newResetPassword !== confirmResetPassword) {
        alert("As palavras-passe introduzidas não coincidem!");
        return;
      }

      const val = validatePasswordPolicy(newResetPassword, userSec.passwordHistory);
      if (!val.isValid) {
        alert("A palavra-passe não cumpre todos os requisitos de segurança:\n\n• " + val.errors.join("\n• "));
        return;
      }

      // Apply new password
      const updatedHistory = [newResetPassword, ...userSec.passwordHistory].slice(0, 5);
      setUserSecurityMap(prev => ({
        ...prev,
        [browserEmail]: {
          ...userSec,
          failedAttempts: 0,
          cooldownUntil: null,
          cooldownPassed: false,
          postCooldownAttempts: 0,
          isLocked: false,
          mustResetPassword: false,
          passwordHistory: updatedHistory,
        }
      }));

      createSecurityLog(
        browserEmail,
        "PASSWORD_RESET_SUCCESS",
        "Palavra-passe redefinida com sucesso respeitando o mínimo de 12 caracteres, maiúsculas, minúsculas, números, símbolos e lista do histórico das últimas 5 passwords. Conta desbloqueada! Todos os tokens de sessão anteriores foram revogados."
      );

      // Invalidate all old session tokens
      invalidateUserSessions(browserEmail);

      alert("✅ Palavra-passe redefinida com sucesso! A conta foi desbloqueada e todos os tokens de sessão antigos foram revogados.");
      setBrowserResetMode(false);
      setBrowserResetSent(false);
      setNewResetPassword("");
      setConfirmResetPassword("");
      setLoginErrorMessage("");
    };

    const runBiometricLogin = () => {
      if (userSec.isLocked) {
        setLoginErrorMessage("⚠️ Esta conta está BLOQUEADA por motivo de segurança.");
        return;
      }
      if (userSec.cooldownUntil && userSec.cooldownUntil > Date.now()) {
        setLoginErrorMessage("🔒 Login em cooldown. Aguarde o fim do tempo de segurança.");
        return;
      }

      setBrowserBiometricScan(true);
      setBrowserBiometricProgress(0);
      const interval = setInterval(() => {
        setBrowserBiometricProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setBrowserBiometricScan(false);
              handleAuthenticateBrowser(browserSelectedRole, true);
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    };

    // Calculate pass policy for reset preview
    const resetPolicyVal = validatePasswordPolicy(newResetPassword, userSec.passwordHistory);

    return (
      <div className={`h-screen w-screen flex flex-col items-center justify-center p-3 transition-all duration-300 ${theme === "dark" ? "bg-[#030712] text-slate-100" : "bg-slate-950 text-slate-100"}`}>
        
        {/* COMPACT CARD CONTAINMENT (~30% size reduction, NO SCROLLBAR) */}
        <div className="max-w-[380px] w-full bg-slate-900/95 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl my-auto text-center space-y-3 relative overflow-hidden">
          
          {/* Top Logo */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="h-20 sm:h-24 w-full flex items-center justify-center overflow-visible my-1">
              <img 
                src={whiteLabelLogo || condoManagerLogo} 
                alt="CondoManager AI" 
                className="h-16 sm:h-20 w-auto max-w-[280px] object-contain select-none drop-shadow-2xl transition-transform scale-125 sm:scale-135" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-2">
              <h2 className="text-sm font-black tracking-tight text-white uppercase font-sans">
                {browserResetMode ? "Recuperação & Desbloqueio" : "Portal de Autenticação"}
              </h2>
            </div>
          </div>

          {/* ACTIVE LOCKOUT / COOLDOWN / WARNING BANNERS */}
          {userSec.isLocked ? (
            <div className="bg-red-950/80 border border-red-500/60 p-2.5 rounded-xl text-left space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-bold text-xs">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Conta Bloqueada por Brute Force</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">
                Foram detetadas múltiplas tentativas falhadas consecutivas. É obrigatório redefinir a palavra-passe para desbloquear.
              </p>
            </div>
          ) : userSec.cooldownUntil && userSec.cooldownUntil > Date.now() ? (
            <div className="bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-xl text-center space-y-1 animate-pulse">
              <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold text-xs">
                <i className="fa-solid fa-shield-halved text-sm"></i>
                <span>Bloqueio de Segurança Ativo</span>
              </div>
              <p className="text-[11px] text-amber-200 font-mono font-bold">
                Aguarde {cooldownSeconds}s para voltar a tentar
              </p>
              <div className="text-[9px] text-slate-400 flex items-center justify-center space-x-1 pt-0.5">
                <i className="fa-solid fa-robot"></i>
                <span>Proteção contra Bots & IP ativa</span>
              </div>
            </div>
          ) : userSec.cooldownPassed ? (
            <div className="bg-blue-950/80 border border-blue-500/50 p-2 rounded-xl text-left space-y-0.5">
              <span className="text-[10px] font-bold text-blue-300 flex items-center gap-1">
                <i className="fa-solid fa-info-circle"></i> Fase Pós-Bloqueio (3 Tentativas)
              </span>
              <p className="text-[9px] text-slate-300">
                Aviso: Restam <strong>{3 - userSec.postCooldownAttempts}</strong> tentativa(s) antes do bloqueio total da conta.
              </p>
            </div>
          ) : null}

          {/* ERROR MESSAGE ALERT */}
          {loginErrorMessage && !userSec.cooldownUntil && !userSec.isLocked && (
            <div className="bg-red-950/60 border border-red-500/40 p-2 rounded-lg text-red-300 text-[10px] font-medium text-left flex items-center justify-between">
              <span>{loginErrorMessage}</span>
              <button onClick={() => setLoginErrorMessage("")} className="text-red-400 hover:text-white ml-2">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {browserResetMode ? (
            /* PASSWORD RESET MODE WITH SECURITY POLICY CHECKLIST */
            <div className="space-y-2.5 text-left pt-0.5">
              {browserResetSent ? (
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-xl space-y-2 text-center">
                  <div className="h-8 w-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-sm">
                    <i className="fa-solid fa-envelope-circle-check"></i>
                  </div>
                  <h4 className="text-xs font-bold text-emerald-300">E-mail de Desbloqueio Enviado!</h4>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Enviámos o link de redefinição para: <strong className="text-white font-mono">{browserEmail}</strong>.
                  </p>

                  {/* Form to directly reset pass with security validation */}
                  <div className="pt-2 border-t border-emerald-500/30 space-y-2 text-left">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                      Redefinir Palavra-passe com Segurança
                    </span>
                    
                    <input
                      type="password"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Nova Palavra-passe (mín 12 caract)..."
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 font-mono text-white focus:outline-none focus:border-emerald-500"
                    />

                    <input
                      type="password"
                      value={confirmResetPassword}
                      onChange={(e) => setConfirmResetPassword(e.target.value)}
                      placeholder="Confirmar Nova Palavra-passe..."
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 font-mono text-white focus:outline-none focus:border-emerald-500"
                    />

                    {/* LIVE POLICY CHECKLIST */}
                    {newResetPassword && (
                      <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-[9px] space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Força: <strong className="text-emerald-400">{resetPolicyVal.label}</strong></span>
                          <span>{resetPolicyVal.score}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-slate-400">
                          <span className={resetPolicyVal.criteria.minLength ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.minLength ? "✓" : "○"} 12+ caracteres
                          </span>
                          <span className={resetPolicyVal.criteria.hasUppercase ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.hasUppercase ? "✓" : "○"} Maiúscula (A-Z)
                          </span>
                          <span className={resetPolicyVal.criteria.hasLowercase ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.hasLowercase ? "✓" : "○"} Minúscula (a-z)
                          </span>
                          <span className={resetPolicyVal.criteria.hasNumber ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.hasNumber ? "✓" : "○"} Número (0-9)
                          </span>
                          <span className={resetPolicyVal.criteria.hasSymbol ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.hasSymbol ? "✓" : "○"} Símbolo (!@#$)
                          </span>
                          <span className={resetPolicyVal.criteria.notInHistory ? "text-emerald-400 font-bold" : "text-slate-500"}>
                            {resetPolicyVal.criteria.notInHistory ? "✓" : "○"} Não usada recentemente
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handlePerformResetWithPolicy}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                    >
                      Gravar Nova Password & Desbloquear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      E-mail do Perfil a Desbloquear
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={browserEmail}
                        onChange={(e) => setBrowserEmail(e.target.value)}
                        placeholder="utilizador@condomanager.pt"
                        className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 pl-8 font-medium text-white focus:outline-none focus:border-emerald-500"
                      />
                      <i className="fa-solid fa-envelope absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!browserEmail.trim()) {
                        alert("Por favor introduza o seu e-mail!");
                        return;
                      }
                      createSecurityLog(browserEmail, "PASSWORD_RESET_REQUESTED", "Pedido de e-mail de redefinição de palavra-passe e desbloqueio enviado.");
                      setBrowserResetSent(true);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2 rounded-lg text-xs tracking-wider uppercase cursor-pointer transition-all shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <i className="fa-solid fa-key text-xs"></i>
                    <span>Enviar E-mail de Desbloqueio</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setBrowserResetMode(false);
                  setBrowserResetSent(false);
                }}
                className="w-full text-center text-[11px] text-slate-400 hover:text-white pt-1 block cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-1"></i> Voltar ao Login
              </button>
            </div>
          ) : (
            /* NORMAL LOGIN FORM */
            <div className="space-y-2.5 text-left pt-0.5">
              
              {/* Role Selector */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Perfil de Acesso
                </label>
                <select
                  value={browserSelectedRole}
                  onChange={(e) => handleBrowserRoleChange(e.target.value as LoggedUser["role"])}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ADMIN">👑 Carlos Administrador (Administrador Interno)</option>
                  <option value="EMPRESA_GESTORA">🏢 Gestão Forte, Lda (Empresa Gestora)</option>
                  <option value="USER">🏠 Ana Silva (Portal do Condómino)</option>
                  <option value="TECNICO">🔍 Eng. Rui Melo (Inspector Técnico)</option>
                  <option value="LIMPEZAS">🧹 Maria Silva (Equipa de Higienização)</option>
                  <option value="JURIDICO">⚖️ Dra. Margarida (Perfil Jurídico / Contencioso)</option>
                  <option value="AUDITOR">🕵️ Dr. António (Auditor Independente)</option>
                  <option value="CONTABILISTA">📈 Dra. Paula (Contabilista Certificado)</option>
                </select>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  E-mail de Utilizador
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={browserEmail}
                    onChange={(e) => {
                      setBrowserEmail(e.target.value);
                      setLoginErrorMessage("");
                    }}
                    placeholder="utilizador@condomanager.pt"
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 pl-8 font-medium text-white focus:outline-none focus:border-emerald-500"
                  />
                  <i className="fa-solid fa-envelope absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Palavra-passe / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBrowserResetMode(true);
                      setBrowserResetSent(false);
                    }}
                    className="text-[9px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer transition-colors"
                  >
                    Esqueceu-se da password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={browserPassword}
                    onChange={(e) => {
                      setBrowserPassword(e.target.value);
                      setLoginErrorMessage("");
                    }}
                    placeholder="Introduza a palavra-passe..."
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 pl-8 font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  <i className="fa-solid fa-lock absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                </div>
              </div>

              {/* Biometrics Scan Overlay */}
              {browserBiometricScan && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 text-center space-y-1 animate-pulse">
                  <div className="flex items-center justify-center space-x-1.5 text-emerald-400 text-xs font-bold">
                    <i className="fa-solid fa-fingerprint text-sm animate-bounce"></i>
                    <span>Verificação Biométrica (Face ID)... {browserBiometricProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${browserBiometricProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 space-y-1.5">
                <button
                  type="button"
                  disabled={Boolean(userSec.cooldownUntil && userSec.cooldownUntil > Date.now()) || userSec.isLocked}
                  onClick={() => handleAuthenticateBrowser(browserSelectedRole)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-2 rounded-lg text-center text-xs tracking-wider uppercase cursor-pointer transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-solid fa-right-to-bracket text-xs"></i>
                  <span>Entrar com Password</span>
                </button>

                <button
                  type="button"
                  disabled={Boolean(userSec.cooldownUntil && userSec.cooldownUntil > Date.now()) || userSec.isLocked}
                  onClick={runBiometricLogin}
                  className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-emerald-400 font-bold py-1.5 rounded-lg text-center text-[10px] flex items-center justify-center space-x-1.5 border border-emerald-500/30 cursor-pointer transition-all"
                >
                  <i className="fa-solid fa-fingerprint text-xs text-emerald-400"></i>
                  <span>Entrar com Dados Biométricos</span>
                </button>

                {/* TEST SIMULATION BUTTON FOR INCORRECT PASS / BRUTE FORCE TESTING */}
                <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleFailedAttempt}
                    className="text-[9px] text-amber-400/80 hover:text-amber-300 font-medium cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <i className="fa-solid fa-bug"></i>
                    <span>Simular Password Errada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSecurityModalOpen(true)}
                    className="text-[9px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Logs Supabase</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-500 font-mono">
            <span>SECURE SUPABASE AUTH</span>
            <span>CondoManager AI © 2026</span>
          </div>

        </div>

        {/* SECURITY AUDIT LOGS MODAL */}
        <SecurityAuditModal
          isOpen={securityModalOpen}
          onClose={() => setSecurityModalOpen(false)}
          currentEmail={browserEmail}
          failedCount={userSec.failedAttempts}
          isLocked={userSec.isLocked}
        />

      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex overflow-hidden transition-all duration-300 ${theme === "dark" ? "bg-[#0b0f19] text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      
      {/* BARRA LATERAL (MENU ESCURO) */}
      <aside className={`w-72 h-full flex flex-col select-none shrink-0 z-20 no-print transition-all duration-300 ${theme === "dark" ? "bg-[#030712] text-slate-300 border-r border-slate-900/50" : "bg-slate-900 text-slate-300"}`}>
        {/* Logo */}
        <div 
          onClick={() => {
            setActiveSection("painel");
            setViewMode("BROWSER");
            setIaInitialTab(undefined);
          }}
          className="w-full h-20 border-b border-slate-800 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:opacity-95 transition-all duration-300 p-3"
          title="Ir para a Página Inicial (Dashboard)"
        >
          <img 
            src={whiteLabelLogo || condoManagerLogo} 
            alt="CondoManager AI" 
            className="w-full h-full object-contain scale-110 sm:scale-120 select-none hover:scale-125 transition-transform duration-300 drop-shadow-xl" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Seletor de Condomínio */}
        <div className="px-4 py-2 border-b border-slate-800 shrink-0">
          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 px-2">Condomínio Ativo</label>
          <div className="relative">
            <select 
              value={activePredioId}
              onChange={(e) => setActivePredioId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-7"
            >
              {predios.map(p => (
                <option key={p.id_predio} value={p.id_predio}>{p.nome || `${p.morada_linha1} ${p.num_porta}`}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 px-2 flex items-center">
            <i className="fa-solid fa-location-dot text-slate-500 mr-1 shrink-0"></i>
            <span className="truncate">{predioAtivo.morada_linha1} {predioAtivo.num_porta}, {predioAtivo.localidade}</span>
          </p>
        </div>

        {/* Navegação */}
        <nav className="flex-grow px-3 py-4 space-y-1.5 overflow-y-auto">
          
          {/* Dashboard da Administração */}
          <button 
            id="sidebar-item-dashboard"
            onClick={() => {
              setActiveSection("painel");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "painel" ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
          >
            <i className="fa-solid fa-chart-line w-4 text-center text-indigo-400"></i>
            <span>Dashboard da Administração</span>
          </button>

          {/* Cadastro de Prédio */}
          <button 
            id="sidebar-item-predios"
            onClick={() => {
              setActiveSection("predios");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "predios" ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
          >
            <i className="fa-solid fa-building w-4 text-center text-blue-400"></i>
            <span>Cadastro de Prédio</span>
          </button>

          {/* Frações (Expandable Accordion Menu) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-fracoes"
              onClick={() => {
                setOpenMenuFracoes(!openMenuFracoes);
                if (!["fracoes", "fracoes_nova", "fracoes_proprietario", "fracoes_perfis"].includes(activeSection)) {
                  setActiveSection("fracoes");
                }
                setViewMode("BROWSER");
                setIaInitialTab(undefined);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${["fracoes", "fracoes_nova", "fracoes_proprietario", "fracoes_perfis"].includes(activeSection) ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-door-open w-4 text-center text-emerald-450"></i>
                <span>Frações</span>
              </div>
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuFracoes ? "rotate-180" : ""}`}></i>
            </button>

            {openMenuFracoes && (
              <div className="pl-6 space-y-1 border-l-2 border-emerald-500/40 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("fracoes_nova");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "fracoes_nova" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-plus-circle w-3.5 text-center text-[11px]"></i>
                  <span>Cadastrar Nova Fração</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("fracoes_proprietario");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "fracoes_proprietario" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-user-plus w-3.5 text-center text-[11px]"></i>
                  <span>Cadastrar Proprietário</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("fracoes_perfis");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "fracoes_perfis" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-id-card-clip w-3.5 text-center text-[11px]"></i>
                  <span>Perfis de Acesso dos Condóminos</span>
                </button>
              </div>
            )}
          </div>

          {/* Mensagens */}
          <button 
            id="sidebar-item-condominos"
            onClick={() => {
              setActiveSection("portal_condomino");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "portal_condomino" ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
          >
            <i className="fa-solid fa-comments w-4 text-center text-teal-400"></i>
            <span>Mensagens</span>
          </button>

          {/* Arquivo (Menu Principal Autónomo) */}
          <button 
            id="sidebar-item-arquivo"
            onClick={() => {
              setActiveSection("arquivo");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
              activeSection === "arquivo" || activeSection === "documentos"
                ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm`
                : "text-slate-400 hover:text-white hover:bg-slate-800/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-box-archive w-4 text-center text-emerald-400"></i>
              <span>Arquivo</span>
            </div>
            <span className="bg-emerald-600/80 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 border border-emerald-400/30 shadow-md flex items-center justify-center min-w-[20px] h-5">
              3
            </span>
          </button>

          {/* Novo Menu: Vistorias & Intervenções (Accordion) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-vistorias-intervencoes"
              onClick={() => {
                setOpenMenuVistoriasIntervencoes(!openMenuVistoriasIntervencoes);
                if (!["manutencao_ocorrencias", "ocorrencias", "limpezas_vistorias", "manutencao_intervencoes", "manutencao_concluidas", "manutencao_agenda", "manutencao_extraordinarias"].includes(activeSection)) {
                  setActiveSection("manutencao_ocorrencias");
                }
                setViewMode("BROWSER");
                setIaInitialTab(undefined);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                ["manutencao_ocorrencias", "ocorrencias", "limpezas_vistorias", "manutencao_intervencoes", "manutencao_concluidas", "manutencao_agenda", "manutencao_extraordinarias"].includes(activeSection)
                  ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm`
                  : "text-slate-400 hover:text-white hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-clipboard-list w-4 text-center text-orange-400"></i>
                <span>Vistorias & Intervenções</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-orange-600 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 border border-white/20 shadow-md flex items-center justify-center min-w-[20px] h-5">
                  6
                </span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuVistoriasIntervencoes ? "rotate-180" : ""}`}></i>
              </div>
            </button>

            {openMenuVistoriasIntervencoes && (
              <div className="pl-6 space-y-1 border-l-2 border-orange-500/40 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("manutencao_ocorrencias");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "manutencao_ocorrencias" || activeSection === "ocorrencias" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-triangle-exclamation w-3.5 text-center text-[11px]"></i>
                  <span>Ocorrências</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("limpezas_vistorias");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "limpezas_vistorias" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-clipboard-check w-3.5 text-center text-[11px]"></i>
                  <span>Vistoria Técnica</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("manutencao_intervencoes");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "manutencao_intervencoes" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-screwdriver-wrench w-3.5 text-center text-[11px]"></i>
                  <span>Intervenções (Reparações)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("manutencao_concluidas");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "manutencao_concluidas" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-circle-check w-3.5 text-center text-[11px]"></i>
                  <span>Intervenções Concluídas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("manutencao_agenda");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "manutencao_agenda" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-calendar-days w-3.5 text-center text-[11px]"></i>
                  <span>Agenda de Manutenção</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection("manutencao_extraordinarias");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "manutencao_extraordinarias" ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-hammer w-3.5 text-center text-[11px]"></i>
                  <span>Intervenções Extraordinárias (Obras)</span>
                </button>
              </div>
            )}
          </div>

          {/* Limpezas (Accordion Menu) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-limpezas"
              onClick={() => {
                setOpenMenuLimpezas(!openMenuLimpezas);
                if (!["vistorias_limpezas", "limpezas_incidencias"].includes(activeSection)) {
                  setActiveSection("vistorias_limpezas");
                }
                setViewMode("BROWSER");
                setIaInitialTab(undefined);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${["vistorias_limpezas", "limpezas_incidencias"].includes(activeSection) ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-broom w-4 text-center text-emerald-450"></i>
                <span>Limpezas</span>
              </div>
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuLimpezas ? "rotate-180" : ""}`}></i>
            </button>

            {openMenuLimpezas && (
              <div className="pl-6 space-y-1 border-l-2 border-emerald-500/40 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("vistorias_limpezas");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "vistorias_limpezas" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-broom w-3.5 text-center text-[11px]"></i>
                  <span>Limpezas</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("limpezas_incidencias");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "limpezas_incidencias" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-circle-exclamation w-3.5 text-center text-[11px]"></i>
                  <span>Incidências (enviadas pelas limpezas)</span>
                </button>
              </div>
            )}
          </div>

          {/* Financeiro (Expandable Accordion Menu) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-financeiro"
              onClick={() => {
                setOpenMenuFinanceiro(!openMenuFinanceiro);
                if (!["movimentos", "financeiro_recibos", "financeiro_relatorios", "financeiro_extratos", "financeiro_quotas_mensais", "financeiro_quotas_extra"].includes(activeSection)) {
                  setActiveSection("movimentos");
                }
                setViewMode("BROWSER");
                setIaInitialTab(undefined);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${["movimentos", "financeiro_recibos", "financeiro_relatorios", "financeiro_extratos", "financeiro_quotas_mensais", "financeiro_quotas_extra"].includes(activeSection) ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-wallet w-4 text-center text-cyan-400"></i>
                <span>Financeiro</span>
              </div>
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuFinanceiro ? "rotate-180" : ""}`}></i>
            </button>

            {openMenuFinanceiro && (
              <div className="pl-6 space-y-1 border-l-2 border-slate-700/60 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("financeiro_recibos");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "financeiro_recibos" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-file-invoice-dollar w-3.5 text-center text-[11px]"></i>
                  <span>Emissão de Recibos Manuais</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("movimentos");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "movimentos" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-list-check w-3.5 text-center text-[11px]"></i>
                  <span>Registo de Movimentos</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("financeiro_relatorios");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "financeiro_relatorios" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-chart-pie w-3.5 text-center text-[11px]"></i>
                  <span>Relatórios de Dívidas</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("financeiro_extratos");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "financeiro_extratos" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-scale-unbalanced w-3.5 text-center text-[11px]"></i>
                  <span>Extrato de Movimentos e Saldo</span>
                </button>
              </div>
            )}
          </div>

          {/* Reuniões & Convocatórias (Manuais ou IA) */}
          <button 
            id="sidebar-item-assembleias"
            onClick={() => {
              setActiveSection("assembleias");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
              activeSection === "assembleias"
                ? "bg-emerald-600 text-white font-extrabold shadow-sm border border-emerald-500"
                : "text-slate-400 hover:text-white hover:bg-slate-800/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-gavel w-4 text-center text-emerald-400"></i>
              <span>Reuniões & Convocatórias</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black rounded px-1.5 py-0.5 border border-emerald-500/30">
              IA
            </span>
          </button>

          {/* Jurídico com assistência de AI (Expandable Accordion Menu) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-juridico-ai"
              onClick={() => {
                setOpenMenuJuridico(!openMenuJuridico);
                if (!["contencioso_juridico", "contencioso_juridico_nd", "contencioso_juridico_doc_obrig", "contencioso_juridico_cartas", "contencioso_juridico_bni", "contencioso_juridico_regulamento", "contencioso_juridico_estatutos", "contencioso_juridico_ia"].includes(activeSection)) {
                  setActiveSection("contencioso_juridico");
                }
                setViewMode("BROWSER");
                setIaInitialTab(undefined);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                ["contencioso_juridico", "contencioso_juridico_nd", "contencioso_juridico_doc_obrig", "contencioso_juridico_cartas", "contencioso_juridico_bni", "contencioso_juridico_regulamento", "contencioso_juridico_estatutos", "contencioso_juridico_ia"].includes(activeSection)
                  ? "bg-red-600 text-white font-extrabold shadow-sm border border-red-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-scale-balanced w-4 text-center text-red-400"></i>
                <span>Jurídico com assistência de AI</span>
              </div>
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuJuridico ? "rotate-180" : ""}`}></i>
            </button>

            {openMenuJuridico && (
              <div className="pl-6 space-y-1 border-l-2 border-red-500/40 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-folder-open w-3.5 text-center text-[11px]"></i>
                  <span>Resumo de Contencioso</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_nd");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_nd" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-file-contract w-3.5 text-center text-[11px]"></i>
                  <span>Carta de Não Dívida</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_doc_obrig");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_doc_obrig" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-file-shield w-3.5 text-center text-[11px]"></i>
                  <span>Documentos Obrigatórios</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_cartas");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_cartas" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-envelope-open-text w-3.5 text-center text-[11px]"></i>
                  <span>Carta de Cobrança</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_bni");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_bni" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-gavel w-3.5 text-center text-[11px]"></i>
                  <span>Injunção Judicial</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_regulamento");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_regulamento" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-file-invoice w-3.5 text-center text-[11px]"></i>
                  <span>Regulamento Interno</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_estatutos");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_estatutos" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-scroll w-3.5 text-center text-[11px]"></i>
                  <span>Estatutos do Prédio</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("contencioso_juridico_ia");
                    setViewMode("BROWSER");
                    setIaInitialTab(undefined);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "contencioso_juridico_ia" ? "bg-violet-500/20 text-violet-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-pink-400 w-3.5 text-center text-[11px]"></i>
                  <span>Assistente IA</span>
                </button>
              </div>
            )}
          </div>

          {/* Fornecedores */}
          <button 
            id="sidebar-item-fornecedores"
            onClick={() => {
              setActiveSection("fornecedores");
              setViewMode("BROWSER");
              setIaInitialTab(undefined);
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "fornecedores" ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
          >
            <i className="fa-solid fa-truck w-4 text-center text-yellow-500"></i>
            <span>Fornecedores</span>
          </button>

          {/* Central de Comunicações (Expandable Accordion Menu) */}
          <div className="space-y-1">
            <button 
              id="sidebar-item-comunicacao"
              onClick={() => {
                setOpenMenuComunicacoes(!openMenuComunicacoes);
                if (!["comunicacao_broadcast", "comunicacao_chat", "comunicacao_sondagens", "comunicacao_questionarios"].includes(activeSection)) {
                  setActiveSection("comunicacao_broadcast");
                }
                setViewMode("BROWSER");
                setIaInitialTab("comunicacoes_adenda");
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                ["comunicacao_broadcast", "comunicacao_chat", "comunicacao_sondagens", "comunicacao_questionarios"].includes(activeSection) || (activeSection === "ia_avancada" && iaInitialTab === "comunicacoes_adenda")
                  ? "bg-sky-600 text-white font-extrabold shadow-sm border border-sky-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-comments w-4 text-center text-sky-400"></i>
                <span>Central de Comunicações</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-sky-500/20 text-sky-300 text-[9px] font-black rounded px-1.5 py-0.5 border border-sky-500/30">
                  4 Submenus
                </span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${openMenuComunicacoes ? "rotate-180" : ""}`}></i>
              </div>
            </button>

            {openMenuComunicacoes && (
              <div className="pl-6 space-y-1 border-l-2 border-sky-500/40 ml-3.5 my-1">
                <button
                  onClick={() => {
                    setActiveSection("comunicacao_broadcast");
                    setViewMode("BROWSER");
                    setIaInitialTab("comunicacoes_adenda");
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "comunicacao_broadcast" ? "bg-sky-500/20 text-sky-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-bullhorn w-3.5 text-center text-[11px]"></i>
                  <span>Comunicados & Avisos Globais</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("comunicacao_chat");
                    setViewMode("BROWSER");
                    setIaInitialTab("comunicacoes_adenda");
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "comunicacao_chat" ? "bg-sky-500/20 text-sky-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-envelope-open-text w-3.5 text-center text-[11px]"></i>
                  <span>Mensagens Diretas & Inbox</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("comunicacao_sondagens");
                    setViewMode("BROWSER");
                    setIaInitialTab("comunicacoes_adenda");
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "comunicacao_sondagens" ? "bg-sky-500/20 text-sky-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-square-poll-horizontal w-3.5 text-center text-[11px]"></i>
                  <span>Sondagens Rápidas & Votações</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSection("comunicacao_questionarios");
                    setViewMode("BROWSER");
                    setIaInitialTab("comunicacoes_adenda");
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer flex items-center gap-2 ${activeSection === "comunicacao_questionarios" ? "bg-sky-500/20 text-sky-300 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
                >
                  <i className="fa-solid fa-clipboard-question w-3.5 text-center text-[11px]"></i>
                  <span>Questionários & Inquéritos</span>
                </button>
              </div>
            )}
          </div>

          {/* IA & Exportações */}
          <button 
            id="sidebar-item-ia-export"
            onClick={() => {
              setActiveSection("ia_avancada");
              setViewMode("BROWSER");
              setIaInitialTab("cerebro_ia");
            }}
            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "ia_avancada" && iaInitialTab === "cerebro_ia" ? `${getColorClasses("bgLight")} ${getColorClasses("text")} font-extrabold shadow-sm` : "text-slate-400 hover:text-white hover:bg-slate-800/30"}`}
          >
            <i className="fa-solid fa-microchip w-4 text-center text-purple-400"></i>
            <span>IA & Exportações</span>
          </button>

          {/* Opção Extra Configs para o Admin */}
          {["ADMIN", "EMPRESA_GESTORA"].includes(loggedUser.role) && (
            <div className="pt-2 mt-2 border-t border-slate-800">
              <button 
                id="sidebar-item-ficha-gestora"
                onClick={() => {
                  setActiveSection("ficha_gestora");
                  setViewMode("BROWSER");
                  setIaInitialTab(undefined);
                }}
                className={`w-full text-left px-3.5 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${activeSection === "ficha_gestora" ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white hover:bg-slate-800/20"}`}
              >
                <i className="fa-solid fa-briefcase w-4 text-center text-slate-400"></i>
                <span>Configurar Ficha Empresa Gestora</span>
              </button>
            </div>
          )}

        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Definições</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
                className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded px-1 py-0.5 font-bold cursor-pointer flex items-center"
                title="Alternar Tema de Cores"
              >
                {theme === "light" ? (
                  <>
                    <i className="fa-solid fa-sun mr-1 text-amber-400"></i> Claro
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-moon mr-1 text-indigo-400"></i> Escuro
                  </>
                )}
              </button>
              <button 
                onClick={handleToggleUserRole}
                className="text-[8px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded px-1 py-0.5 font-bold tracking-tight cursor-pointer"
              >
                PAPEL
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 shrink-0">
                <i className="fa-solid fa-user-shield text-[10px]"></i>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate leading-tight">{loggedUser.nome}</p>
                <p className="text-[9px] text-emerald-400 font-bold tracking-tight leading-tight">{loggedUser.role} Mode</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setBrowserIsLoggedOut(true);
              }}
              className="p-2 bg-red-900/80 hover:bg-red-600 text-white border border-red-600/80 hover:border-red-400 rounded-xl transition-all cursor-pointer shrink-0 shadow-md hover:scale-105 flex items-center justify-center min-w-[40px] min-h-[40px]"
              title="Sair da Conta (Desligar)"
            >
              <img 
                src={logoutIcon} 
                alt="Sair" 
                className="h-5 w-5 object-contain filter drop-shadow brightness-110" 
              />
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE TRABALHO PRINCIPAL */}
      <main className={`flex-grow flex flex-col h-full overflow-hidden relative transition-all duration-300 ${theme === "dark" ? "bg-[#0b0f19]" : "bg-slate-50"}`}>
        {/* Header superior */}
        <header className={`h-16 px-8 flex items-center justify-between shrink-0 z-10 no-print transition-all duration-300 ${theme === "dark" ? "bg-[#111827] border-b border-slate-800 text-slate-100" : "bg-white border-b border-slate-200 text-slate-800"}`}>
          <div>
            <h2 className={`text-xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              {activeSection === "painel" && "Painel de Controlo"}
              {activeSection === "predios" && "Cadastro de Prédio"}
              {(activeSection === "fracoes" || activeSection === "fracoes_nova" || activeSection === "fracoes_proprietario" || activeSection === "fracoes_perfis") && "Gestão de Frações, Proprietários & Perfis"}
              {activeSection === "fornecedores" && "Fichas de Fornecedores"}
              {activeSection === "contas" && "Contas Bancárias do Condomínio"}
              {activeSection === "emissao" && "Emissão de Avisos e Orçamentos"}
              {activeSection === "movimentos" && "Registo de Movimentos Financeiros"}
              {activeSection === "financeiro_recibos" && "Emissão de Recibos Manuais (100% Editável)"}
              {activeSection === "financeiro_relatorios" && "Relatórios de Dívidas (por Condómino & Pro Condomínio)"}
              {activeSection === "financeiro_extratos" && "Extrato de Movimentos e Saldo (Visão Condómino)"}
              {activeSection === "financeiro_quotas_mensais" && "Mapa de Quotas Mensais de Condomínio"}
              {activeSection === "financeiro_quotas_extra" && "Quotas Extraordinárias & Fundos Especiais"}
              {activeSection === "conciliacao" && "Motor de Inteligência Artificial para Conciliação"}
              {activeSection === "assembleias" && "Reuniões e Convocatórias (Elaboradas Manualmente ou com Auxílio de IA)"}
              {activeSection === "reservas" && "Agenda & Reservas de Espaços Comuns"}
              {(activeSection === "documentos" || activeSection === "arquivo") && "Arquivo Digital (Anos & Temas)"}
              {activeSection === "ocorrencias" && "Gestão de Ocorrências e Avarias"}
              {(activeSection === "vistorias_limpezas" || activeSection === "limpezas_vistorias") && "Limpezas & Vistorias Técnicas"}
              {activeSection === "ia_avancada" && "Central de Inteligência Artificial Avançada"}
              {activeSection === "ia_importacao" && "Assistente de Importação Global por IA (PDF/XLS)"}
              {activeSection === "contencioso_juridico" && "Resumo de Contencioso & Prazos Legais"}
              {activeSection === "contencioso_juridico_nd" && "Carta de Não Dívida (Art. 54.º-A do DL 268/94)"}
              {activeSection === "contencioso_juridico_doc_obrig" && "Documentos Obrigatórios do Condomínio"}
              {activeSection === "contencioso_juridico_cartas" && "Carta de Cobrança (Notificação AR Regimental)"}
              {activeSection === "contencioso_juridico_bni" && "Injunção Judicial Civil & Requerimento BNI"}
              {activeSection === "contencioso_juridico_regulamento" && "Regulamento Interno do Edifício"}
              {activeSection === "contencioso_juridico_estatutos" && "Estatutos do Prédio & Propriedade Horizontal"}
              {activeSection === "contencioso_juridico_ia" && "Assistente IA de Contencioso & Minutas Legais"}
              {activeSection === "obras_futuras" && "Obras Futuras & Fundo Extraordinário"}
              {activeSection === "ficha_gestora" && "Ficha da Empresa Gestora (White-Label)"}
              {activeSection === "portal_condomino" && "Portal do Condómino & Perfis"}
              {activeSection === "portal_orcamentos" && "Portal de Orçamentos de Fornecedores"}
              {activeSection === "dashboard_kpis" && "Dashboard de KPIs do Prédio"}
              {activeSection === "multi_condominio" && "Portal Multi-Condomínio Integrado"}
              {activeSection === "configuracoes_gerais" && "Configurações Gerais do Condomínio"}
              {activeSection === "configuracoes_ia" && "Configurações do Assistente IA e E-mail"}
              {activeSection === "configuracoes_notificacoes" && "Configurações de Notificações Push & E-mail"}
              {activeSection === "inventario_tecnico" && "Inventário Técnico e Arquitetura do Prédio"}
              {activeSection === "manutencao_ocorrencias" && "Ocorrências & Avarias Reportadas"}
              {activeSection === "manutencao_agenda" && "Agenda de Manutenção & Vistorias"}
              {activeSection === "manutencao_intervencoes" && "Intervenções (Pequenas Reparações)"}
              {activeSection === "manutencao_extraordinarias" && "Intervenções Extraordinárias (Grandes Obras)"}
              {activeSection === "manutencao_concluidas" && "Histórico de Manutenções Concluídas"}
              {activeSection === "manutencao_arquivo" && "Arquivo Documental Registado"}
            </h2>
            <p className={`text-xs transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Isolamento Multi-Prédio Ativo no Servidor: {predioAtivo.nome || `${predioAtivo.morada_linha1} ${predioAtivo.num_porta}`}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-xs font-mono-custom font-medium px-2.5 py-1 rounded border transition-colors duration-300 ${theme === "dark" ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
              NIF: {predioAtivo.nif}
            </span>
            <div className={`h-8 w-px transition-colors duration-300 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}></div>
            <span className={`text-xs ${getColorClasses("bgLight")} ${getColorClasses("text")} font-semibold px-2.5 py-1 rounded border ${getColorClasses("border")} flex items-center transition-all duration-300`}>
              <span className={`h-1.5 w-1.5 rounded-full ${getColorClasses("bg")} mr-1.5 animate-pulse`}></span>
              {loggedUser.role === "ADMIN" ? "👑 Administrador" : 
               loggedUser.role === "EMPRESA_GESTORA" ? "🏢 Empresa Gestora" :
               loggedUser.role === "USER" ? "🏠 Condómino" :
               loggedUser.role === "TECNICO" ? "🔍 Técnico" :
               loggedUser.role === "LIMPEZAS" ? "🧹 Limpezas" : 
               loggedUser.role === "JURIDICO" ? "⚖️ Jurídico" :
               loggedUser.role === "AUDITOR" ? "🕵️ Auditor" : "📈 Contabilista"}
            </span>

            <button
              onClick={() => setUserProfileModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Aceder ao Perfil e Submenu Expansível de Segurança"
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Perfil & Segurança</span>
            </button>

            <button
              id="header-btn-logout"
              onClick={() => setBrowserIsLoggedOut(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-500 text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 group shrink-0"
              title="Terminar Sessão (Voltar ao Ecrã de Login)"
            >
              <img 
                src={terminarSessaoIcon} 
                alt="Terminar Sessão" 
                className="h-5 w-5 object-contain transition-transform group-hover:scale-110 filter drop-shadow brightness-110" 
              />
              <span className="font-extrabold tracking-wide">Terminar Sessão</span>
            </button>
          </div>
        </header>

        {/* PAINEL DE CONTROLO DO SIMULADOR E PERFIS */}
        <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print shrink-0 transition-colors duration-300">
          <div className="flex items-center space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">Seletor de Perfil & Simulador PWA</span>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-800/80 shadow-sm text-xs">
            <button
              onClick={() => setViewMode("BROWSER")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${viewMode === "BROWSER" ? "bg-slate-900 dark:bg-slate-800 text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              <i className="fa-solid fa-desktop text-[11px]"></i>
              <span>💻 Navegador Web</span>
            </button>
            <button
              onClick={() => setViewMode("PWA")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${viewMode === "PWA" ? `${getColorClasses("bg")} text-white` : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              <i className="fa-solid fa-mobile-screen text-[11px]"></i>
              <span>📱 Simulador PWA</span>
            </button>
          </div>

          {/* Profiles selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-950 p-1.5 rounded-xl border dark:border-slate-800/80 shadow-sm text-[10px] font-bold max-w-full">
            <button 
              onClick={() => handleProfileChange("ADMIN")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "ADMIN" ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Administrador (Empresa Gestora) - Perfil Máximo"
            >
              👑 Admin
            </button>
            <button 
              onClick={() => handleProfileChange("EMPRESA_GESTORA")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "EMPRESA_GESTORA" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Empresa Gestora - Perfil Máximo de Backoffice"
            >
              🏢 Gestora
            </button>
            <button 
              onClick={() => handleProfileChange("USER")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "USER" ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Condómino - PWA + Backoffice Limitado"
            >
              🏠 Condómino
            </button>
            <button 
              onClick={() => handleProfileChange("TECNICO")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "TECNICO" ? "bg-amber-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Técnico de Manutenção - PWA + Backoffice Limitado"
            >
              🔍 Técnico
            </button>
            <button 
              onClick={() => handleProfileChange("LIMPEZAS")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "LIMPEZAS" ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Empresa de Limpeza - PWA Limitado"
            >
              🧹 Limpezas
            </button>
            <button 
              onClick={() => handleProfileChange("JURIDICO")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "JURIDICO" ? "bg-red-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Perfil Jurídico - Contencioso e Contratos"
            >
              ⚖️ Jurídico
            </button>
            <button 
              onClick={() => handleProfileChange("AUDITOR")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "AUDITOR" ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Auditor Interno (Opcional) - Apenas Consulta"
            >
              🕵️ Auditor
            </button>
            <button 
              onClick={() => handleProfileChange("CONTABILISTA")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${loggedUser.role === "CONTABILISTA" ? "bg-rose-500 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              title="Contabilista (Opcional) - Validação e Extratos"
            >
              📈 Contabilista
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="flex-grow p-8 overflow-y-auto">
          {viewMode === "PWA" ? (
            <PWASimulator 
              predio={predioAtivo}
              fracoes={fracoes}
              setFracoes={setFracoes}
              avisos={avisos}
              setAvisos={setAvisos}
              movements={movements}
              setMovements={setMovements}
              reservas={reservas}
              setReservas={setReservas}
              ocorrencias={ocorrencias}
              setOcorrencias={setOcorrencias}
              documentos={documentos}
              setDocumentos={setDocumentos}
              loggedUser={loggedUser}
              setLoggedUser={setLoggedUser}
              theme={theme}
              contas={contas}
              setContas={setContas}
              fornecedores={fornecedores}
              setFornecedores={setFornecedores}
              reunioes={reunioes}
              setReunioes={setReunioes}
              capacidades={capacidades}
              setCapacidades={setCapacidades}
            />
          ) : (
            <>
              {activeSection === "ficha_gestora" && (
                <FichaEmpresaGestora 
                  predios={predios}
                  loggedUser={loggedUser}
                  onUpdateBrandingColor={setBrandingColor}
                  activeColor={brandingColor}
                  onUpdateBrandingLogo={setWhiteLabelLogo}
                  activeLogo={whiteLabelLogo}
                />
              )}

              {activeSection === "painel" && (
                <PainelControlo 
                  predio={predioAtivo} 
                  contas={contas} 
                  fracoes={fracoes} 
                  movements={movements} 
                  avisos={avisos}
                  ocorrenciasCount={ocorrencias.filter(o => o.id_predio === predioAtivo.id_predio).length}
                  reservasCount={reservas.filter(r => r.id_predio === predioAtivo.id_predio).length}
                  mensagensCount={2}
                  notificacoesCount={6}
                />
              )}

          {activeSection === "predios" && (
            <GestaoPredios 
              predios={predios} 
              onAddPredio={handleAddPredio} 
              onUpdatePredio={handleUpdatePredio}
              onDeletePredio={handleDeletePredio}
              loggedUser={loggedUser}
            />
          )}

          {["fracoes", "fracoes_nova", "fracoes_proprietario", "fracoes_perfis"].includes(activeSection) && (
            <GestaoFracoes 
              predio={predioAtivo} 
              fracoes={fracoes} 
              onAddFracao={handleAddFracao}
              onUpdateFracoes={handleUpdateFracoes}
              loggedUser={loggedUser}
              avisos={avisos}
              setAvisos={setAvisos}
              activeSubSection={activeSection}
            />
          )}

          {activeSection === "fornecedores" && (
            <GestaoFornecedores 
              predio={predioAtivo} 
              fornecedores={fornecedores} 
              onAddFornecedor={handleAddFornecedor}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "contas" && (
            <GestaoContas 
              predio={predioAtivo} 
              contas={contas} 
              onAddConta={handleAddConta}
              onSetPrincipalConta={handleSetPrincipalConta}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "emissao" && (
            <GestaoEmissao 
              predio={predioAtivo} 
              fracoes={fracoes} 
              avisos={avisos} 
              setAvisos={setAvisos}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "movimentos" && (
            <GestaoMovimentos 
              predio={predioAtivo} 
              contas={contas} 
              movements={movements} 
              setMovements={setMovements}
              loggedUser={loggedUser}
            />
          )}

          {["financeiro_recibos", "financeiro_relatorios", "financeiro_extratos", "financeiro_quotas_mensais", "financeiro_quotas_extra"].includes(activeSection) && (
            <FinanceiroAvancado
              predio={predioAtivo}
              fracoes={fracoes}
              movimentos={movements}
              loggedUser={loggedUser}
              activeSubSection={activeSection as any}
              initialTab={
                activeSection === "financeiro_recibos" ? "recibos_manuais" :
                activeSection === "financeiro_relatorios" ? "relatorio_dividas" :
                activeSection === "financeiro_extratos" ? "extrato_saldos" :
                activeSection === "financeiro_quotas_mensais" ? "quotas_mensais" :
                activeSection === "financeiro_quotas_extra" ? "quotas_extra" : "recibos_manuais"
              }
            />
          )}

          {activeSection === "fundo_reserva" && (
            <GestaoFundoReserva 
              predio={predioAtivo} 
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "contabilidade_interna" && (
            <ContabilidadeInterna 
              predio={predioAtivo} 
              loggedUser={loggedUser}
              movimentos={movements}
            />
          )}

          {activeSection === "relatorios_automaticos" && (
            <GestaoRelatorios 
              predio={predioAtivo} 
              loggedUser={loggedUser}
              movimentos={movements}
              fracoes={fracoes}
            />
          )}

          {activeSection === "auditoria_interna" && (
            <AuditoriaInterna 
              predio={predioAtivo} 
              loggedUser={loggedUser}
              movimentos={movements}
              fracoes={fracoes}
              documentos={documentos}
              contas={contas}
            />
          )}

          {activeSection === "conciliacao" && (
            <IAConciliacao 
              predio={predioAtivo} 
              fracoes={fracoes}
              avisos={avisos}
              setAvisos={setAvisos}
              movements={movements}
              setMovements={setMovements}
              contas={contas}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "assembleias" && (
            <GestaoAssembleias 
              predio={predioAtivo} 
              fracoes={fracoes}
              reunioes={reunioes} 
              onAddReuniao={handleAddReuniao}
              setReunioes={setReunioes}
              loggedUser={loggedUser}
            />
          )}

          {(activeSection === "documentos" || activeSection === "arquivo" || activeSection === "manutencao_arquivo") && (
            <GestaoDocumentos 
              predio={predioAtivo} 
              documentos={documentos} 
              onAddDocumento={handleAddDocumento}
              setDocumentos={setDocumentos}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "reservas" && (
            <GestaoReservas 
              predio={predioAtivo}
              fracoes={fracoes}
              reservas={reservas}
              setReservas={setReservas}
              capacidades={capacidades}
              setCapacidades={setCapacidades}
              loggedUser={loggedUser}
            />
          )}

          {["manutencao_ocorrencias", "manutencao_agenda", "manutencao_intervencoes", "manutencao_extraordinarias", "manutencao_concluidas"].includes(activeSection) && (
            <GestaoManutencaoIntervencoes 
              predio={predioAtivo} 
              fracoes={fracoes}
              ocorrencias={ocorrencias} 
              setOcorrencias={setOcorrencias}
              movements={movements}
              setMovements={setMovements}
              contas={contas}
              documentos={documentos}
              setDocumentos={setDocumentos}
              fornecedores={fornecedores}
              loggedUser={loggedUser}
              activeSubSection={activeSection}
              setActiveSubSection={setActiveSection}
            />
          )}

          {["vistorias_limpezas", "limpezas_incidencias", "limpezas_vistorias"].includes(activeSection) && (
            <GestaoVistoriasLimpezas 
              predio={predioAtivo}
              loggedUser={loggedUser}
              activeSubSection={activeSection}
            />
          )}

          {(activeSection === "ia_avancada" || ["comunicacao_broadcast", "comunicacao_chat", "comunicacao_sondagens", "comunicacao_questionarios"].includes(activeSection)) && (
            <IAAvancada 
              predio={predioAtivo}
              fracoes={fracoes}
              avisos={avisos}
              movements={movements}
              fornecedores={fornecedores}
              loggedUser={loggedUser}
              initialTab={iaInitialTab || "comunicacoes_adenda"}
              commSubTabProp={
                activeSection === "comunicacao_broadcast" ? "broadcast" :
                activeSection === "comunicacao_chat" ? "chat" :
                activeSection === "comunicacao_sondagens" ? "sondagens" :
                activeSection === "comunicacao_questionarios" ? "questionarios" : undefined
              }
            />
          )}

          {activeSection === "ia_importacao" && (
            <AssistenteImportacao 
              onImportComplete={handleImportGlobalData}
              loggedUser={loggedUser}
            />
          )}

          {["configuracoes_gerais", "configuracoes_ia", "configuracoes_notificacoes"].includes(activeSection) && (
            <ConfiguracoesAdministracao 
              predio={predioAtivo}
              loggedUser={loggedUser}
              documentos={documentos}
              movimentos={movements}
              fracoes={fracoes}
              activeSubSection={
                activeSection === "configuracoes_ia" ? "ia" :
                activeSection === "configuracoes_notificacoes" ? "notificacoes" : "gerais"
              }
              setActiveSubSection={(sub) => {
                if (sub === "ia") setActiveSection("configuracoes_ia");
                else if (sub === "notificacoes") setActiveSection("configuracoes_notificacoes");
                else setActiveSection("configuracoes_gerais");
              }}
              onUpdatePredio={handleUpdatePredio}
              onAddDocumento={handleAddDocumento}
            />
          )}

          {activeSection === "inventario_tecnico" && (
            <InventarioTecnico 
              predio={predioAtivo}
              loggedUser={loggedUser}
            />
          )}

          {["contencioso_juridico", "contencioso_juridico_nd", "contencioso_juridico_doc_obrig", "contencioso_juridico_cartas", "contencioso_juridico_bni", "contencioso_juridico_regulamento", "contencioso_juridico_estatutos", "contencioso_juridico_ia"].includes(activeSection) && (
            <ContenciosoJuridico 
              predio={predioAtivo}
              fracoes={fracoes}
              avisos={avisos}
              loggedUser={loggedUser}
              onAddDocumento={handleAddDocumento}
              initialTab={
                activeSection === "contencioso_juridico_nd" ? "carta_nao_divida" :
                activeSection === "contencioso_juridico_doc_obrig" ? "documentos_obrigatorios" :
                activeSection === "contencioso_juridico_cartas" ? "cartasar" :
                activeSection === "contencioso_juridico_bni" ? "injuncões" :
                activeSection === "contencioso_juridico_regulamento" ? "regulamento" :
                activeSection === "contencioso_juridico_estatutos" ? "estatutos" :
                activeSection === "contencioso_juridico_ia" ? "assistente_ia" : "geral"
              }
            />
          )}

          {activeSection === "portal_condomino" && (
            <PortalCondomino 
              predio={predioAtivo}
              fracoes={fracoes}
              onUpdateFracoes={handleUpdateFracoes}
              avisos={avisos}
              setAvisos={setAvisos}
              movements={movements}
              setMovements={setMovements}
              contas={contas}
              loggedUser={loggedUser}
              setLoggedUser={setLoggedUser}
            />
          )}

          {activeSection === "portal_orcamentos" && (
            <PortalOrcamentos 
              predio={predioAtivo}
              fornecedores={fornecedores}
              onAddFornecedor={handleAddFornecedor}
              loggedUser={loggedUser}
            />
          )}

          {activeSection === "dashboard_kpis" && (
            <DashboardKPIs 
              predio={predioAtivo}
              fracoes={fracoes}
              avisos={avisos}
              movimentos={movements}
              reservas={reservas}
              ocorrencias={ocorrencias}
            />
          )}

          {activeSection === "multi_condominio" && (
            <MultiCondominio 
              predios={predios}
              fracoes={fracoes}
              avisos={avisos}
              movimentos={movements}
              reservas={reservas}
              ocorrencias={ocorrencias}
              contas={contas}
              loggedUser={loggedUser}
              onUpdatePredio={handleUpdatePredio}
            />
          )}
            </>
          )}
        </div>
      </main>

      {/* GLOBAL USER SECURITY MODAL */}
      <UserSecurityModal
        isOpen={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
        loggedUser={loggedUser}
        biometricsEnabled={biometricsEnabled}
        setBiometricsEnabled={setBiometricsEnabled}
      />

    </div>
  );
}
