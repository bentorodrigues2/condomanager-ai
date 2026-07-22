import { Icon } from './Icon';
import React, { useState, useEffect, useRef } from "react";
import { Predio, Fracao, LoggedUser, Aviso, Conta, Movimento } from "../types";

// Inner Interfaces
export interface MensagemAdministracao {
  id: string;
  id_fracao: string;
  nome_remetente: string;
  assunto: string;
  mensagem: string;
  data: string;
  anexoWebP: string | null;
  estado: "Pendente" | "Respondida";
  respostaAdmin?: string;
  dataResposta?: string;
}

export interface ComprovativoSubmetido {
  id: string;
  id_fracao: string;
  id_aviso: string;
  nome_fracao: string;
  valorOriginal: number;
  dataOriginal: string;
  ibanOriginal: string;
  referenciaOriginal: string;
  descricaoOriginal: string;
  anexoWebP: string;
  // Extracted values
  valorExtraido: number;
  dataExtraida: string;
  ibanExtraido: string;
  referenciaExtraida: string;
  identificadoPor: "ReferÃªncia" | "IBAN (Regra AutomÃ¡tica)" | "Manual";
  // User corrections
  descricaoCorrigida: string;
  estado: "Pendente" | "Confirmado" | "Rejeitado";
  dataSubmissao: string;
  reciboGerado?: string;
}

interface PortalCondominoProps {
  predio: Predio;
  fracoes: Fracao[];
  onUpdateFracoes: (updated: Fracao[]) => void;
  avisos: Aviso[];
  setAvisos: React.Dispatch<React.SetStateAction<Aviso[]>>;
  movements: Movimento[];
  setMovements: React.Dispatch<React.SetStateAction<Movimento[]>>;
  contas: Conta[];
  loggedUser: LoggedUser;
  setLoggedUser: (user: LoggedUser) => void;
}

export function PortalCondomino({
  predio,
  fracoes,
  onUpdateFracoes,
  avisos,
  setAvisos,
  movements,
  setMovements,
  contas,
  loggedUser,
  setLoggedUser,
}: PortalCondominoProps) {
  // Navigation inside Portal
  const [activeTab, setActiveTab] = useState<"portal" | "backoffice">("portal");

  // Local State representing PWA messages, payment proofs, and credentials
  const [mensagens, setMensagens] = useState<MensagemAdministracao[]>([
    {
      id: "msg-1",
      id_fracao: "frac-1",
      nome_remetente: "Ana Silva (FraÃ§Ã£o A)",
      assunto: "Avaria no Elevador Principal",
      mensagem: "OlÃ¡, o elevador principal estÃ¡ a fazer um ruÃ­do estranho desde ontem Ã  noite. Podem verificar por favor?",
      data: "14-07-2026 18:30",
      anexoWebP: null,
      estado: "Respondida",
      respostaAdmin: "Obrigado pelo aviso, Ana. JÃ¡ agendÃ¡mos uma vistoria de urgÃªncia com a OTIS para amanhÃ£ de manhÃ£.",
      dataResposta: "14-07-2026 19:15",
    },
  ]);

  const [comprovativos, setComprovativos] = useState<ComprovativoSubmetido[]>([
    {
      id: "comp-1",
      id_fracao: "frac-1",
      nome_fracao: "A",
      id_aviso: "aviso-1",
      valorOriginal: 120,
      dataOriginal: "12-07-2026",
      ibanOriginal: "PT50 0035 0999 8888 7777 6666 5",
      referenciaOriginal: "",
      descricaoOriginal: "Fatura Quota Julho",
      anexoWebP: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4TBAAAAAvAAAAAFAIAnQ=",
      valorExtraido: 120,
      dataExtraida: "12-07-2026",
      ibanExtraido: "PT50 0035 0999 8888 7777 6666 5",
      referenciaExtraida: "",
      identificadoPor: "IBAN (Regra AutomÃ¡tica)",
      descricaoCorrigida: "Quota de Julho FraÃ§Ã£o A - Confirmada",
      estado: "Pendente",
      dataSubmissao: "12-07-2026 10:25",
    },
  ]);

  // Credentials and Security State
  const [tempPassMap, setTempPassMap] = useState<{ [fracaoId: string]: string }>({
    "frac-1": "Cnd-X3y9B",
    "frac-2": "Cnd-W1z7A",
  });
  const [pwaSentMsg, setPwaSentMsg] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState("");
  const [biometricsActive, setBiometricsActive] = useState(false);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Profile Edit State
  const [editedNome, setEditedNome] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedTlm, setEditedTlm] = useState("");
  const [editedNif, setEditedNif] = useState("");
  const [editedIban, setEditedIban] = useState("");
  const [editedTitular, setEditedTitular] = useState("");
  const [editedBanco, setEditedBanco] = useState("");
  const [editedBirthday, setEditedBirthday] = useState("1989-10-15");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Add Message Modal/State
  const [msgDrawerOpen, setMsgDrawerOpen] = useState(false);
  const [newMsgAssunto, setNewMsgAssunto] = useState("");
  const [newMsgTexto, setNewMsgTexto] = useState("");
  const [newMsgAnexo, setNewMsgAnexo] = useState<string | null>(null);
  const [anexoSizeOriginal, setAnexoSizeOriginal] = useState<string>("");
  const [anexoSizeWebP, setAnexoSizeWebP] = useState<string>("");
  const [msgSending, setMsgSending] = useState(false);

  // Add Payment Modal/State
  const [payAvisoId, setPayAvisoId] = useState<string>("");
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [paymentOriginalSize, setPaymentOriginalSize] = useState<string>("");
  const [paymentWebPSize, setPaymentWebPSize] = useState<string>("");
  const [extractionLoading, setExtractionLoading] = useState(false);
  const [extractedValue, setExtractedValue] = useState<number>(0);
  const [extractedDate, setExtractedDate] = useState<string>("");
  const [extractedIban, setExtractedIban] = useState<string>("");
  const [extractedRef, setExtractedRef] = useState<string>("");
  const [extractedIdType, setExtractedIdType] = useState<"ReferÃªncia" | "IBAN (Regra AutomÃ¡tica)" | "Manual">("Manual");
  const [payerFractionName, setPayerFractionName] = useState<string>("");
  const [payerFractionId, setPayerFractionId] = useState<string>("");
  const [userDescCorrection, setUserDescCorrection] = useState("");

  // Backoffice Responses
  const [adminReplyTexts, setAdminReplyTexts] = useState<{ [msgId: string]: string }>({});

  // Birthday modal
  const [birthdayModalOpen, setBirthdayModalOpen] = useState(false);
  const [welcomeMailModal, setWelcomeMailModal] = useState<{ fracao: Fracao; pass: string } | null>(null);

  // Refs
  const profileFileRef = useRef<HTMLInputElement>(null);
  const msgFileRef = useRef<HTMLInputElement>(null);
  const payFileRef = useRef<HTMLInputElement>(null);

  // Sync edited fields with loggedUser
  useEffect(() => {
    // Find active fraction matching the user
    const userFracao = fracoes.find((f) => f.proprietario.email === loggedUser.email);
    if (userFracao) {
      setEditedNome(userFracao.proprietario.nome);
      setEditedEmail(userFracao.proprietario.email);
      setEditedTlm(userFracao.proprietario.tlm);
      setEditedNif(userFracao.proprietario.nif);
      setEditedIban(userFracao.proprietario.iban || "");
      setEditedTitular(userFracao.proprietario.titular_conta || "");
      setEditedBanco(userFracao.proprietario.entidade_bancaria || "");
    } else {
      setEditedNome(loggedUser.nome);
      setEditedEmail(loggedUser.email);
    }
  }, [loggedUser, fracoes]);

  // Set default active tab based on role
  useEffect(() => {
    if (loggedUser.role === "ADMIN") {
      setActiveTab("backoffice");
    } else {
      setActiveTab("portal");
    }
  }, [loggedUser.role]);

  // Convert base64 and compress to WebP helper
  const convertToWebP = (
    file: File,
    callback: (base64Webp: string, originalSizeKb: string, webpSizeKb: string) => void
  ) => {
    const originalSize = (file.size / 1024).toFixed(1) + " KB";
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 800; // Resize for speed/efficiency
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        ctx?.drawImage(img, 0, 0, w, h);
        const webpData = canvas.toDataURL("image/webp", 0.7);
        // Estimate WebP size from base64 string
        const webpSize = Math.round((webpData.length * 3) / 4 / 1024).toFixed(1) + " KB";
        callback(webpData, originalSize, webpSize);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Profile WebP Update
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    convertToWebP(file, (webpUrl) => {
      // Update local state and current fraction photo
      const updatedFracoes = fracoes.map((f) => {
        if (f.proprietario.email === loggedUser.email) {
          return {
            ...f,
            proprietario: { ...f.proprietario, foto: webpUrl },
          };
        }
        return f;
      });
      onUpdateFracoes(updatedFracoes);
      setProfileSuccessMsg("Foto de perfil atualizada e otimizada em WebP!");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    });
  };

  // Submit Profile Changes (except address)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedNome || !editedEmail || !editedNif) {
      alert("Por favor, preencha os campos obrigatÃ³rios (Nome, E-mail, NIF).");
      return;
    }

    const updated = fracoes.map((f) => {
      if (f.proprietario.email === loggedUser.email) {
        return {
          ...f,
          proprietario: {
            ...f.proprietario,
            nome: editedNome,
            email: editedEmail,
            tlm: editedTlm,
            nif: editedNif,
            iban: editedIban,
            titular_conta: editedTitular,
            entidade_bancaria: editedBanco,
          },
        };
      }
      return f;
    });

    onUpdateFracoes(updated);
    setLoggedUser({
      ...loggedUser,
      nome: editedNome,
      email: editedEmail,
    });

    setProfileSuccessMsg("Dados pessoais guardados com sucesso! A morada mantÃ©m-se inalterada.");
    setTimeout(() => setProfileSuccessMsg(""), 4000);
  };

  // Password temporary trigger
  const triggerTempPassword = (fracaoId: string) => {
    const randomPass = "Cnd-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTempPassMap((prev) => ({ ...prev, [fracaoId]: randomPass }));
    alert(`Uma nova password provisÃ³ria foi gerada automaticamente: ${randomPass}`);
  };

  // Welcome Email Dialog
  const triggerWelcomeEmail = (fracao: Fracao) => {
    const pass = tempPassMap[fracao.id_fracao] || "Cnd-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    if (!tempPassMap[fracao.id_fracao]) {
      setTempPassMap((prev) => ({ ...prev, [fracao.id_fracao]: pass }));
    }
    setWelcomeMailModal({ fracao, pass });
  };

  // Password Recovery Simulator
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    const cleanEmail = recoveryEmail.trim().toLowerCase();
    const targetFracao = fracoes.find((f) => f.proprietario.email.toLowerCase() === cleanEmail);

    if (!targetFracao) {
      setRecoveryStatus("E-mail nÃ£o encontrado no sistema deste condomÃ­nio.");
      return;
    }

    const newTemp = "Cnd-R" + Math.random().toString(36).substring(2, 7).toUpperCase();
    setTempPassMap((prev) => ({ ...prev, [targetFracao.id_fracao]: newTemp }));
    setRecoveryStatus(
      `Sucesso! Uma nova password provisÃ³ria (${newTemp}) foi enviada para ${cleanEmail}.`
    );
    setRecoveryEmail("");
    setTimeout(() => setRecoveryStatus(""), 8000);
  };

  // Biometric authentication flow
  const handleToggleBiometrics = () => {
    if (!biometricsActive) {
      // Activating
      setBiometricProgress(0);
      setBiometricSuccess(false);
      setBiometricModalOpen(true);
      const interval = setInterval(() => {
        setBiometricProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setBiometricSuccess(true);
            setTimeout(() => {
              setBiometricModalOpen(false);
              setBiometricsActive(true);
            }, 1500);
            return 100;
          }
          return p + 10;
        });
      }, 150);
    } else {
      setBiometricsActive(false);
      alert("Acesso biomÃ©trico desativado.");
    }
  };

  // Simulate Biometric login
  const simulateBiometricLogin = () => {
    setBiometricProgress(0);
    setBiometricSuccess(false);
    setBiometricModalOpen(true);
    const interval = setInterval(() => {
      setBiometricProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setBiometricSuccess(true);
          setTimeout(() => {
            setBiometricModalOpen(false);
            alert(`SessÃ£o iniciada com sucesso via biometria! Bem-vindo, ${loggedUser.nome}.`);
          }, 1500);
          return 100;
        }
        return p + 20;
      });
    }, 100);
  };

  // Send PWA Link Simulator
  const handleSendPwaLink = () => {
    setPwaSentMsg(true);
    setTimeout(() => setPwaSentMsg(false), 5000);
  };

  // Birthday simulation
  const simulateBirthdayEmail = () => {
    setBirthdayModalOpen(true);
  };

  // Contact Drawer submit
  const handleSendMsgToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgAssunto || !newMsgTexto) {
      alert("Por favor, preencha o assunto e o texto da mensagem.");
      return;
    }
    setMsgSending(true);

    setTimeout(() => {
      const userFracao = fracoes.find((f) => f.proprietario.email === loggedUser.email);
      const novaMsg: MensagemAdministracao = {
        id: "msg-" + (mensagens.length + 1),
        id_fracao: userFracao?.id_fracao || "frac-1",
        nome_remetente: `${loggedUser.nome} (FraÃ§Ã£o ${userFracao?.fracao_nome || "A"})`,
        assunto: newMsgAssunto,
        mensagem: newMsgTexto,
        data: new Date().toLocaleString("pt-PT"),
        anexoWebP: newMsgAnexo,
        estado: "Pendente",
      };

      setMensagens((prev) => [novaMsg, ...prev]);
      setNewMsgAssunto("");
      setNewMsgTexto("");
      setNewMsgAnexo(null);
      setAnexoSizeOriginal("");
      setAnexoSizeWebP("");
      setMsgSending(false);
      setMsgDrawerOpen(false);
      alert("A sua mensagem foi enviada Ã  AdministraÃ§Ã£o! Pode acompanhar o estado no painel.");
    }, 1200);
  };

  // Attachment upload for message (WebP converted)
  const handleMessageAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    convertToWebP(file, (webpUrl, origSize, webpSize) => {
      setNewMsgAnexo(webpUrl);
      setAnexoSizeOriginal(origSize);
      setAnexoSizeWebP(webpSize);
    });
  };

  // Quota payment proof upload & AI extraction
  const initiatePaymentProof = (aviso: Aviso) => {
    setPayAvisoId(aviso.id_aviso);
    setPaymentFile(null);
    setPaymentOriginalSize("");
    setPaymentWebPSize("");
    setExtractedValue(0);
    setExtractedDate("");
    setExtractedIban("");
    setExtractedRef("");
    setUserDescCorrection("");
    setPayModalOpen(true);
  };

  const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    convertToWebP(file, (webpUrl, origSize, webpSize) => {
      setPaymentFile(webpUrl);
      setPaymentOriginalSize(origSize);
      setPaymentWebPSize(webpSize);
      runAIExtraction(webpUrl);
    });
  };

  // AI Extraction Simulator
  const runAIExtraction = (webpBase64: string) => {
    setExtractionLoading(true);

    setTimeout(() => {
      // Find current user's fraction to test IBAN matching rule
      const userFracao = fracoes.find((f) => f.proprietario.email === loggedUser.email) || fracoes[0];
      const targetAviso = avisos.find((a) => a.id_aviso === payAvisoId);

      // Simulate extraction
      const mockValue = targetAviso?.valor || 120.0;
      const mockDate = new Date().toLocaleDateString("pt-PT").replace(/\//g, "-");
      // Use user's real IBAN to trigger "regra: se nÃ£o houver referÃªncia -> identificar pelo IBAN"
      const mockIban = userFracao.proprietario.iban || "PT50 0035 0999 8888 7777 6666 5";
      const mockRef = ""; // intentionally blank to test the rule!

      setExtractedValue(mockValue);
      setExtractedDate(mockDate);
      setExtractedIban(mockIban);
      setExtractedRef(mockRef);

      // Rule Check: No reference -> identify by IBAN
      if (!mockRef) {
        const matchingFracao = fracoes.find(
          (f) =>
            f.proprietario.iban?.replace(/\s/g, "") === mockIban.replace(/\s/g, "") ||
            f.inquilino?.nif === userFracao.inquilino?.nif
        );
        if (matchingFracao) {
          setExtractedIdType("IBAN (Regra AutomÃ¡tica)");
          setPayerFractionName(matchingFracao.fracao_nome);
          setPayerFractionId(matchingFracao.id_fracao);
        } else {
          setExtractedIdType("Manual");
        }
      } else {
        setExtractedIdType("ReferÃªncia");
      }

      setUserDescCorrection(`Pagamento da Quota Ref ${targetAviso?.descricao || "Julho"}`);
      setExtractionLoading(false);
    }, 2000);
  };

  // Submit payment proof
  const handleSendPaymentProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile || !extractedValue) {
      alert("Por favor, envie o ficheiro de comprovativo e aguarde a extraÃ§Ã£o por IA.");
      return;
    }

    const userFracao = fracoes.find((f) => f.proprietario.email === loggedUser.email) || fracoes[0];
    const novoComp: ComprovativoSubmetido = {
      id: "comp-" + (comprovativos.length + 1),
      id_fracao: payerFractionId || userFracao.id_fracao,
      nome_fracao: payerFractionName || userFracao.fracao_nome,
      id_aviso: payAvisoId,
      valorOriginal: extractedValue,
      dataOriginal: extractedDate,
      ibanOriginal: extractedIban,
      referenciaOriginal: extractedRef,
      descricaoOriginal: `Envio do comprovativo da fraÃ§Ã£o ${userFracao.fracao_nome}`,
      anexoWebP: paymentFile,
      valorExtraido: extractedValue,
      dataExtraida: extractedDate,
      ibanExtraido: extractedIban,
      referenciaExtraida: extractedRef,
      identificadoPor: extractedIdType,
      descricaoCorrigida: userDescCorrection,
      estado: "Pendente",
      dataSubmissao: new Date().toLocaleString("pt-PT"),
    };

    setComprovativos((prev) => [novoComp, ...prev]);
    setPayModalOpen(false);
    alert(
      "Comprovativo submetido com sucesso! O Administrador irÃ¡ agora validar e conciliar."
    );
  };

  // Backoffice admin actions
  const handleConfirmPayment = (comp: ComprovativoSubmetido) => {
    // 1. Mark Aviso as Pago
    const updatedAvisos = avisos.map((a) => {
      if (a.id_aviso === comp.id_aviso) {
        return { ...a, estado: "Pago" };
      }
      return a;
    });
    setAvisos(updatedAvisos);

    // 2. Add New Movimento (Receita)
    const principalConta = contas.find((c) => c.is_principal && c.id_predio === predio.id_predio) || contas[0];
    const numRecibo = `REC-2026-${Math.floor(Math.random() * 900) + 100}`;
    const novoMov: Movimento = {
      id_mov: "mov-" + (movements.length + 1),
      id_predio: predio.id_predio,
      id_conta: principalConta?.id_conta || "cta-1",
      data: new Date().toLocaleDateString("pt-PT").replace(/\//g, "-"),
      tipo: "Receita",
      valor: comp.valorExtraido,
      descricao: `LiquidaÃ§Ã£o Quota - FraÃ§Ã£o ${comp.nome_fracao} (${numRecibo})`,
      categoria: "Quotas de CondomÃ­nio",
      estado: "Conciliado",
    };
    setMovements((prev) => [...prev, novoMov]);

    // 3. Update Comprovativo state
    setComprovativos((prev) =>
      prev.map((c) => (c.id === comp.id ? { ...c, estado: "Confirmado", reciboGerado: numRecibo } : c))
    );

    alert(
      `Pagamento Confirmado! O recibo oficial ${numRecibo} foi gerado automaticamente para a FraÃ§Ã£o ${comp.nome_fracao}.`
    );
  };

  const handleRejectPayment = (compId: string) => {
    setComprovativos((prev) =>
      prev.map((c) => (c.id === compId ? { ...c, estado: "Rejeitado" } : c))
    );
    alert("O comprovativo foi rejeitado. O condÃ³mino serÃ¡ alertado na PWA.");
  };

  // Admin reply to messages
  const handleSendAdminReply = (msgId: string) => {
    const replyText = adminReplyTexts[msgId];
    if (!replyText) return;

    setMensagens((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              estado: "Respondida",
              respostaAdmin: replyText,
              dataResposta: new Date().toLocaleString("pt-PT"),
            }
          : m
      )
    );

    setAdminReplyTexts((prev) => ({ ...prev, [msgId]: "" }));
    alert("Resposta enviada com sucesso para o condÃ³mino!");
  };

  // Billing schedule simulation: Day 25
  const simulateDay25Billing = () => {
    const dataEmissao = "25-07-2026";
    const dataVencimento = "05-08-2026";
    const novasQuotas: Aviso[] = fracoes
      .filter((f) => f.id_predio === predio.id_predio)
      .map((f, index) => {
        const valorQuota = Math.round(f.permilagem * 0.4); // Proportional quota based on permilage
        return {
          id_aviso: `aviso-auto-${Date.now()}-${index}`,
          id_predio: predio.id_predio,
          id_fracao: f.id_fracao,
          tipo: "Quota de CondomÃ­nio",
          data: dataEmissao,
          vencimento: dataVencimento,
          descricao: `Quota OrdinÃ¡ria de Agosto de 2026 (FraÃ§Ã£o ${f.fracao_nome})`,
          valor: valorQuota,
          estado: "Pendente",
        };
      });

    setAvisos((prev) => [...prev, ...novasQuotas]);
    alert(
      `FaturaÃ§Ã£o AutomÃ¡tica do Dia 25 ConcluÃ­da!\nForam geradas ${novasQuotas.length} novas notas de cobranÃ§a para todas as fraÃ§Ãµes relativas ao mÃªs seguinte (Agosto).`
    );
  };

  // Unpaid Quota reminders simulator: Day 5, 10, 15
  const simulateRemindersTrigger = () => {
    const quotasAtraso = avisos.filter(
      (a) => a.id_predio === predio.id_predio && a.estado === "Pendente"
    );
    quotasAtraso.forEach((a) => {
      const fracao = fracoes.find((f) => f.id_fracao === a.id_fracao);
      if (fracao) {
        console.log(
          `[NotificaÃ§Ã£o Remetente AutomÃ¡tico] Alerta de atraso enviado para ${fracao.proprietario.nome} (${fracao.proprietario.email}) - Aviso: ${a.descricao}, Valor: ${a.valor}â‚¬.`
        );
      }
    });

    alert(
      `Roteamento de Lembretes dos Dias 5, 10, 15 Ativado!\nForam disparados ${quotasAtraso.length} alertas automÃ¡ticos por E-mail e Push PWA para todos os condÃ³minos com quotas em atraso.`
    );
  };

  // Active User Fraction
  const activeUserFracao = fracoes.find((f) => f.proprietario.email === loggedUser.email);
  const activeUserAvisos = avisos.filter(
    (a) => a.id_fracao === activeUserFracao?.id_fracao && a.id_predio === predio.id_predio
  );

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div className="flex space-x-2">
          {loggedUser.role === "ADMIN" ? (
            <button
              onClick={() => setActiveTab("backoffice")}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeTab === "backoffice"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <i className="fa-solid fa-laptop-code mr-1.5"></i> Backoffice de Controlo
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("portal")}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeTab === "portal"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <i className="fa-solid fa-home mr-1.5"></i> Portal do CondÃ³mino (PWA)
            </button>
          )}

          {/* Tester toggle so they can inspect both sides easily */}
          <button
            onClick={() => setActiveTab(activeTab === "portal" ? "backoffice" : "portal")}
            className="px-3 py-2 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Alternar vista apenas para simulaÃ§Ã£o do motor"
          >
            <i className="fa-solid fa-arrows-rotate mr-1"></i> Simular Outra Vista ({activeTab === "portal" ? "Backoffice" : "Portal"})
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSendPwaLink}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-share-nodes mr-1.5"></i> Enviar link da PWA
          </button>
          <button
            onClick={simulateBirthdayEmail}
            className="bg-purple-50 border border-purple-200 text-purple-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-purple-100 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-cake-candles mr-1.5"></i> Simular AniversÃ¡rio
          </button>
        </div>
      </div>

      {pwaSentMsg && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-emerald-800 text-xs font-medium animate-fade-in flex items-center shadow-sm">
          <i className="fa-solid fa-check-circle mr-2 text-emerald-500 text-sm"></i>
          <span>
            PWA link de instalaÃ§Ã£o enviado com sucesso! O condÃ³mino recebeu instruÃ§Ãµes via SMS e E-mail de download direto.
          </span>
        </div>
      )}

      {/* --- PORTAL DO CONDÃ“MINO (PWA SCREEN) --- */}
      {activeTab === "portal" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: CondÃ³mino Card & Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8 text-white relative">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100/10 border-2 border-white/40 flex items-center justify-center text-white overflow-hidden relative group shrink-0">
                    {activeUserFracao?.proprietario.foto ? (
                      <img src={activeUserFracao.proprietario.foto} alt="Perfil" className="h-full w-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-3xl"></i>
                    )}
                    <button
                      onClick={() => profileFileRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold"
                    >
                      Alterar
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={profileFileRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{loggedUser.nome}</h3>
                    <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                      FraÃ§Ã£o {activeUserFracao?.fracao_nome || "A"} â€¢ {activeUserFracao?.piso || "R/C Esq"}
                    </p>
                    <p className="text-emerald-100 text-[10px] mt-1 font-mono-custom">
                      Permilagem: {activeUserFracao?.permilagem || 150}â€°
                    </p>
                  </div>
                </div>

                {/* Biometrics button */}
                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-xs text-emerald-100 flex items-center">
                    <i className="fa-solid fa-fingerprint mr-1.5 text-sm"></i> Acesso BiomÃ©trico
                  </span>
                  <div className="flex items-center space-x-2">
                    {biometricsActive && (
                      <button
                        onClick={simulateBiometricLogin}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded"
                      >
                        Autenticar
                      </button>
                    )}
                    <button
                      onClick={handleToggleBiometrics}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        biometricsActive ? "bg-emerald-400" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                          biometricsActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Data Form (Address is Read-only) */}
              <div className="p-6">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Dados do Perfil</h4>
                  
                  {profileSuccessMsg && (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded text-xs font-medium">
                      {profileSuccessMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        value={editedNome}
                        onChange={(e) => setEditedNome(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">E-mail de Login *</label>
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">TelemÃ³vel</label>
                      <input
                        type="text"
                        value={editedTlm}
                        onChange={(e) => setEditedTlm(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">NIF *</label>
                      <input
                        type="text"
                        value={editedNif}
                        onChange={(e) => setEditedNif(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">AniversÃ¡rio</label>
                      <input
                        type="date"
                        value={editedBirthday}
                        onChange={(e) => setEditedBirthday(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">IBAN de CobranÃ§a</label>
                      <input
                        type="text"
                        value={editedIban}
                        onChange={(e) => setEditedIban(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500 font-mono-custom"
                        placeholder="PT50..."
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Titular da Conta</label>
                      <input
                        type="text"
                        value={editedTitular}
                        onChange={(e) => setEditedTitular(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Entidade BancÃ¡ria</label>
                      <input
                        type="text"
                        value={editedBanco}
                        onChange={(e) => setEditedBanco(e.target.value)}
                        className="border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                    </div>

                    {/* Address - Strictly read-only ("exceto morada") */}
                    <div className="flex flex-col col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center">
                        Morada do PrÃ©dio (Bloqueado) <i className="fa-solid fa-lock ml-1 text-slate-400"></i>
                      </label>
                      <input
                        type="text"
                        value={`${predio.morada_linha1}, ${predio.num_porta}`}
                        disabled
                        className="bg-slate-50 border border-slate-100 text-slate-400 px-3 py-1.5 text-xs rounded-lg cursor-not-allowed font-medium"
                      />
                      <span className="text-[9px] text-slate-400 mt-0.5">
                        A alteraÃ§Ã£o da morada requer submissÃ£o de escritura Ã  administraÃ§Ã£o.
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Guardar AlteraÃ§Ãµes do Perfil
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Col 2: Active Quotas & Payments with IA */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Password recovery block inside portal */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-slate-800 mb-3 flex items-center">
                <i className="fa-solid fa-key mr-2 text-emerald-600"></i> RecuperaÃ§Ã£o de Password de Acesso
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Caso se tenha esquecido da sua senha da PWA, insira o seu e-mail cadastrado para gerar uma senha provisÃ³ria automÃ¡tica imediata.
              </p>
              <form onSubmit={handlePasswordRecovery} className="flex gap-2">
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Seu e-mail cadastrado (Ex: ana.silva@gmail.com)"
                  className="flex-grow border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Recuperar
                </button>
              </form>
              {recoveryStatus && (
                <p className={`text-xs font-semibold mt-3 ${recoveryStatus.includes("Sucesso") ? "text-emerald-700" : "text-red-600"}`}>
                  {recoveryStatus}
                </p>
              )}
            </div>

            {/* Quotas / Avisos */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center">
                  <i className="fa-solid fa-file-invoice-dollar mr-2 text-emerald-600"></i> Avisos & Quotas Pendentes
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200 px-2 py-0.5 rounded-full">
                  FraÃ§Ã£o {activeUserFracao?.fracao_nome || "A"}
                </span>
              </div>

              {activeUserAvisos.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  NÃ£o possui quotas pendentes neste prÃ©dio. Bom trabalho!
                </div>
              ) : (
                <div className="space-y-3">
                  {activeUserAvisos.map((aviso) => (
                    <div
                      key={aviso.id_aviso}
                      className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/40 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 text-xs">{aviso.descricao}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              aviso.estado === "Pago"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {aviso.estado}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-[10px] text-slate-500">
                          <span>EmissÃ£o: {aviso.data}</span>
                          <span className="text-red-500 font-medium">Vencimento: {aviso.vencimento}</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 flex items-center space-x-4">
                        <span className="text-base font-bold text-slate-900 font-mono-custom">
                          {aviso.valor.toFixed(2)} â‚¬
                        </span>
                        {aviso.estado !== "Pago" && (
                          <button
                            onClick={() => initiatePaymentProof(aviso)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
                          >
                            <i className="fa-solid fa-upload mr-1.5"></i> Liquidar por IA
                          </button>
                        )}
                        {aviso.estado === "Pago" && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center">
                            <i className="fa-solid fa-circle-check mr-1 text-sm"></i> Recibo Gerado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submissions & Receipt History */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-slate-800 mb-4 flex items-center">
                <i className="fa-solid fa-clock-rotate-left mr-2 text-emerald-600"></i> HistÃ³rico de Comprovativos & Recibos Emitidos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                      <th className="py-2.5">SubmissÃ£o</th>
                      <th className="py-2.5">FraÃ§Ã£o</th>
                      <th className="py-2.5">Valor ExtraÃ­do</th>
                      <th className="py-2.5">IBAN de Envio</th>
                      <th className="py-2.5">Estado</th>
                      <th className="py-2.5 text-right">Recibo Oficial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comprovativos
                      .filter((c) => c.id_fracao === activeUserFracao?.id_fracao)
                      .map((comp) => (
                        <tr key={comp.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-medium text-slate-800">{comp.dataSubmissao}</td>
                          <td className="py-3 font-bold text-slate-600">FraÃ§Ã£o {comp.nome_fracao}</td>
                          <td className="py-3 font-bold text-slate-900 font-mono-custom">{comp.valorExtraido.toFixed(2)} â‚¬</td>
                          <td className="py-3 font-mono-custom text-slate-500 text-[10px]">{comp.ibanExtraido}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                comp.estado === "Confirmado"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : comp.estado === "Rejeitado"
                                  ? "bg-red-50 text-red-700 border border-red-100"
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}
                            >
                              {comp.estado}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {comp.reciboGerado ? (
                              <button
                                onClick={() =>
                                  alert(`--- RECIBO DE QUITAÃ‡ÃƒO OFICIAL ---\nNÃºmero: ${comp.reciboGerado}\nFraÃ§Ã£o: ${comp.nome_fracao}\nValor: ${comp.valorExtraido}â‚¬\nEstado: Liquidado e Conciliado por IA`)
                                }
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors"
                              >
                                <i className="fa-solid fa-file-pdf mr-1 text-red-500"></i> {comp.reciboGerado}
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[10px]">A aguardar validaÃ§Ã£o</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Messaging Inbox / Feed inside Portal */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-slate-800 mb-4 flex items-center">
                <i className="fa-solid fa-message mr-2 text-emerald-600"></i> Suas Mensagens Ã  AdministraÃ§Ã£o
              </h3>
              
              <div className="space-y-4">
                {mensagens
                  .filter((m) => m.id_fracao === activeUserFracao?.id_fracao)
                  .map((m) => (
                    <div key={m.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-800 text-xs">{m.assunto}</span>
                          <p className="text-[10px] text-slate-400">{m.data}</p>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            m.estado === "Respondida"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {m.estado}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded border border-slate-100">
                        {m.mensagem}
                      </p>
                      {m.anexoWebP && (
                        <div className="mt-2 text-[10px] text-slate-500 font-semibold flex items-center">
                          <i className="fa-solid fa-image mr-1 text-emerald-500"></i> Anexo WebP Otimizado anexado
                        </div>
                      )}

                      {m.respostaAdmin && (
                        <div className="mt-3 pl-4 border-l-2 border-emerald-500 bg-emerald-50/30 p-3 rounded">
                          <div className="flex justify-between text-[10px] font-bold text-emerald-800">
                            <span>AdministraÃ§Ã£o</span>
                            <span>{m.dataResposta}</span>
                          </div>
                          <p className="text-xs text-emerald-900 mt-1">{m.respostaAdmin}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BACKOFFICE ADMIN PANEL --- */}
      {activeTab === "backoffice" && (
        <div className="space-y-6">
          {/* Quick Simulation Job Tools */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
              <i className="fa-solid fa-clock text-[200px]"></i>
            </div>
            <h3 className="text-base font-bold uppercase mb-2 flex items-center text-emerald-400">
              <i className="fa-solid fa-gears mr-2"></i> Simulador de Rotinas de FaturaÃ§Ã£o & CobranÃ§a por IA
            </h3>
            <p className="text-xs text-slate-300 mb-4 max-w-2xl">
              Execute tarefas agendadas automÃ¡ticas que simulam o comportamento real de envio de notas de cobranÃ§a no dia 25 e o disparo inteligente de lembretes estruturados em datas cruciais.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={simulateDay25Billing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center shadow-sm"
              >
                <i className="fa-solid fa-calendar-check mr-2"></i> Executar FaturaÃ§Ã£o Dia 25 (Automatizada)
              </button>
              <button
                onClick={simulateRemindersTrigger}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center"
              >
                <i className="fa-solid fa-bell mr-2 text-yellow-400"></i> Disparar Lembretes de Atraso (Dias 5, 10, 15)
              </button>
            </div>
          </div>

          {/* Pending Proofs Verification */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-list-check mr-2 text-slate-700"></i> Comprovativos de Quotas Pendentes de ConciliaÃ§Ã£o
            </h3>

            {comprovativos.filter((c) => c.estado === "Pendente").length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Excelente! NÃ£o existem comprovativos de pagamentos pendentes de aprovaÃ§Ã£o neste prÃ©dio.
              </div>
            ) : (
              <div className="space-y-4">
                {comprovativos
                  .filter((c) => c.estado === "Pendente")
                  .map((comp) => (
                    <div
                      key={comp.id}
                      className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start gap-4"
                    >
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        {/* WebP Attachment simulation preview */}
                        <div className="h-28 w-28 bg-slate-200 rounded-lg flex flex-col items-center justify-center border border-slate-300 p-2 shrink-0 overflow-hidden text-center relative">
                          <i className="fa-solid fa-file-image text-slate-400 text-3xl mb-1"></i>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">COMPROVATIVO.WEBP</span>
                          <span className="text-[7px] text-emerald-600 font-semibold block bg-emerald-50 border border-emerald-100 rounded px-1 mt-1">Otimizado WebP</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">FraÃ§Ã£o {comp.nome_fracao}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                              Identificado por: {comp.identificadoPor}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                            <div className="text-slate-500">
                              Valor ExtraÃ­do por IA:{" "}
                              <strong className="text-slate-800 font-mono-custom">{comp.valorExtraido.toFixed(2)} â‚¬</strong>
                            </div>
                            <div className="text-slate-500">
                              Data ExtraÃ­da: <strong className="text-slate-800">{comp.dataExtraida}</strong>
                            </div>
                            <div className="text-slate-500">
                              IBAN ExtraÃ­do: <strong className="text-slate-800 font-mono-custom text-[10px]">{comp.ibanExtraido}</strong>
                            </div>
                            <div className="text-slate-500">
                              ReferÃªncia Detetada: <strong className="text-slate-800">{comp.referenciaExtraida || "N/A (Identificado por IBAN)"}</strong>
                            </div>
                          </div>

                          <div className="text-xs bg-white p-2.5 rounded border border-slate-100 text-slate-600">
                            <strong>DescriÃ§Ã£o do CondÃ³mino:</strong> {comp.descricaoCorrigida}
                          </div>
                        </div>
                      </div>

                      <div className="flex xl:flex-col gap-2 shrink-0 w-full xl:w-auto">
                        <button
                          onClick={() => handleConfirmPayment(comp)}
                          className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                        >
                          <i className="fa-solid fa-check mr-1.5"></i> Confirmar & Emitir Recibo
                        </button>
                        <button
                          onClick={() => handleRejectPayment(comp.id)}
                          className="flex-grow bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <i className="fa-solid fa-trash-can mr-1.5"></i> Rejeitar Comprovativo
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Perfis de Acesso & Welcome E-mail */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-users-gear mr-2 text-slate-700"></i> Perfis de Acesso dos CondÃ³minos & Portabilidade
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                    <th className="py-2.5">FraÃ§Ã£o</th>
                    <th className="py-2.5">Piso</th>
                    <th className="py-2.5">ProprietÃ¡rio</th>
                    <th className="py-2.5">E-mail Cadastrado</th>
                    <th className="py-2.5">Password ProvisÃ³ria</th>
                    <th className="py-2.5 text-right">AÃ§Ãµes de SeguranÃ§a</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fracoes
                    .filter((f) => f.id_predio === predio.id_predio)
                    .map((frac) => (
                      <tr key={frac.id_fracao} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-900">FraÃ§Ã£o {frac.fracao_nome}</td>
                        <td className="py-3 text-slate-500">{frac.piso}</td>
                        <td className="py-3 font-medium text-slate-800">{frac.proprietario.nome}</td>
                        <td className="py-3 font-mono-custom text-slate-600">{frac.proprietario.email}</td>
                        <td className="py-3 font-mono-custom font-bold text-indigo-600">
                          {tempPassMap[frac.id_fracao] || "NÃ£o AtribuÃ­da"}
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => triggerTempPassword(frac.id_fracao)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-[10px] transition-colors"
                          >
                            <i className="fa-solid fa-arrows-rotate mr-1"></i> Nova Pass
                          </button>
                          <button
                            onClick={() => triggerWelcomeEmail(frac)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded text-[10px] transition-colors"
                          >
                            <i className="fa-solid fa-paper-plane mr-1"></i> Boas-Vindas
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Backoffice messaging inbox */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-envelope-open-text mr-2 text-slate-700"></i> Caixa de Mensagens dos CondÃ³minos
            </h3>

            <div className="space-y-4">
              {mensagens.map((msg) => (
                <div key={msg.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">Assunto: {msg.assunto}</span>
                      <p className="text-[10px] text-slate-400">
                        De: {msg.nome_remetente} â€¢ Recebido em: {msg.data}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        msg.estado === "Respondida"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {msg.estado}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-100">
                    {msg.mensagem}
                  </p>

                  {msg.anexoWebP && (
                    <div className="text-[10px] text-slate-500 font-bold flex items-center">
                      <i className="fa-solid fa-image mr-1 text-emerald-500"></i> Anexo WebP Detetado
                    </div>
                  )}

                  {msg.respostaAdmin ? (
                    <div className="pl-4 border-l-2 border-emerald-500 bg-emerald-50/40 p-3 rounded">
                      <span className="text-[10px] font-bold text-emerald-800 block">Sua resposta:</span>
                      <p className="text-xs text-emerald-950 mt-1">{msg.respostaAdmin}</p>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">{msg.dataResposta}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminReplyTexts[msg.id] || ""}
                        onChange={(e) =>
                          setAdminReplyTexts((prev) => ({ ...prev, [msg.id]: e.target.value }))
                        }
                        placeholder="Escreva a resposta para o condÃ³mino..."
                        className="flex-grow border border-slate-200 px-3 py-1.5 text-xs rounded-lg focus:outline-emerald-500"
                      />
                      <button
                        onClick={() => handleSendAdminReply(msg.id)}
                        className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Responder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING "CONTACTAR ADMINISTRAÃ‡ÃƒO" BUTTON --- */}
      {loggedUser.role === "USER" && (
        <>
          <button
            onClick={() => setMsgDrawerOpen(true)}
            className="fixed bottom-6 right-6 h-12 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 shrink-0 z-40 cursor-pointer animate-pulse-slow"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
            <span className="text-xs uppercase tracking-wider">Contactar AdministraÃ§Ã£o</span>
          </button>

          {/* Send Message Drawer Modal */}
          {msgDrawerOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
              <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-left overflow-y-auto">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Canal Direto com AdministraÃ§Ã£o</h3>
                      <p className="text-[10px] text-slate-500">Mensagens urgentes, avarias ou dÃºvidas regulatÃ³rias</p>
                    </div>
                    <button
                      onClick={() => setMsgDrawerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                  </div>

                  <form onSubmit={handleSendMsgToAdmin} className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Assunto / Categoria *</label>
                      <input
                        type="text"
                        value={newMsgAssunto}
                        onChange={(e) => setNewMsgAssunto(e.target.value)}
                        placeholder="Ex: Avaria no portÃ£o, RuÃ­do nas escadas..."
                        className="border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Mensagem Detalhada *</label>
                      <textarea
                        value={newMsgTexto}
                        onChange={(e) => setNewMsgTexto(e.target.value)}
                        placeholder="Escreva detalhadamente a sua solicitaÃ§Ã£o..."
                        rows={6}
                        className="border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-emerald-500 resize-none"
                        required
                      />
                    </div>

                    {/* WebP Attachment upload */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Anexo / Foto (WebP AutomÃ¡tico)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => msgFileRef.current?.click()}>
                        <i className="fa-solid fa-images text-slate-400 text-2xl mb-1.5"></i>
                        <p className="text-[10px] text-slate-600 font-semibold">Arraste ou clique para selecionar ficheiro</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">O ficheiro serÃ¡ comprimido e guardado como WebP</p>
                        <input
                          type="file"
                          ref={msgFileRef}
                          onChange={handleMessageAttachmentChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {newMsgAnexo && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                          <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-file-shield text-emerald-600 text-sm"></i>
                            <div>
                              <span className="font-bold text-emerald-800 block">Ficheiro Comprimido: anexo_comprovativo.webp</span>
                              <span className="text-slate-500 block">De: {anexoSizeOriginal} â†’ WebP: {anexoSizeWebP} (Otimizado)</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setNewMsgAnexo(null); }}
                            className="text-red-500 font-bold hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={msgSending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-md disabled:bg-slate-400"
                    >
                      {msgSending ? "A enviar..." : "Enviar SolicitaÃ§Ã£o"}
                    </button>
                  </form>
                </div>

                <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-4 mt-6">
                  Sempre em conformidade com o regulamento do prÃ©dio {predio.nome || "Ativo"}.
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- PAYMENT PROOF UPLOAD MODAL --- */}
      {payModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400">LiquidaÃ§Ã£o por InteligÃªncia Artificial</h3>
                <p className="text-[10px] text-slate-300">Carregue o comprovativo e deixe o nosso motor extrair os dados</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSendPaymentProof} className="p-6 space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Selecionar Imagem do Comprovativo (WebP)</label>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => payFileRef.current?.click()}
                >
                  <i className="fa-solid fa-file-invoice text-emerald-500 text-3xl mb-2"></i>
                  <p className="text-xs text-slate-700 font-semibold">Selecione o ficheiro PDF, JPG ou PNG do banco</p>
                  <p className="text-[9px] text-slate-400 mt-1">SerÃ¡ automaticamente convertido em WebP para poupanÃ§a de espaÃ§o</p>
                  <input
                    type="file"
                    ref={payFileRef}
                    onChange={handlePaymentFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {paymentFile && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-600 flex items-center justify-between">
                  <span className="font-semibold text-emerald-700">
                    Original ({paymentOriginalSize}) â†’ Convertido WebP ({paymentWebPSize})
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">CONVERSÃƒO WEBP ACTIVA</span>
                </div>
              )}

              {extractionLoading && (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <div className="h-8 w-8 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                  <p className="text-xs font-semibold text-slate-700">A processar comprovativo com motor IA...</p>
                  <p className="text-[10px] text-slate-400">Extraindo valor, data, IBAN e regras regulamentares</p>
                </div>
              )}

              {paymentFile && !extractionLoading && extractedValue > 0 && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                    <i className="fa-solid fa-microchip mr-1.5"></i> Dados ExtraÃ­dos com Sucesso pela IA
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block uppercase">VALOR EXTRAÃDO</span>
                      <strong className="text-slate-900 font-mono-custom">{extractedValue.toFixed(2)} â‚¬</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100">
                      <span className="text-[9px] text-slate-400 block uppercase">DATA EXTRAÃDA</span>
                      <strong className="text-slate-900">{extractedDate}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100 col-span-2">
                      <span className="text-[9px] text-slate-400 block uppercase">IBAN DETECTADO</span>
                      <strong className="text-slate-900 font-mono-custom text-[10px]">{extractedIban}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100 col-span-2">
                      <span className="text-[9px] text-slate-400 block uppercase">MÃ‰TODO DE IDENTIFICAÃ‡ÃƒO DO PAGADOR</span>
                      <span className="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {extractedIdType} (Identificado para a FraÃ§Ã£o {payerFractionName || "A"})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Corrigir ou Adicionar DescriÃ§Ã£o (CondÃ³mino)
                    </label>
                    <input
                      type="text"
                      value={userDescCorrection}
                      onChange={(e) => setUserDescCorrection(e.target.value)}
                      className="border border-slate-200 px-3 py-2 text-xs rounded-lg focus:outline-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!paymentFile || extractionLoading}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-md disabled:bg-slate-300"
                >
                  Submeter Ã  AdministraÃ§Ã£o
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- BIRTHDAY SIMULATION EMAIL DIALOG --- */}
      {birthdayModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in border border-purple-200">
            <div className="bg-purple-950 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-cake-candles text-purple-400 text-lg"></i>
                <div>
                  <h3 className="font-bold text-sm uppercase">Simulador de E-mail de AniversÃ¡rio</h3>
                  <p className="text-[10px] text-purple-200">Envio automatizado com base na data de nascimento</p>
                </div>
              </div>
              <button onClick={() => setBirthdayModalOpen(false)} className="text-purple-300 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-purple-100 bg-purple-50/40 rounded-xl p-4 text-xs text-purple-950 space-y-3">
                <p><strong>De:</strong> administracao@condomanager.pt</p>
                <p><strong>Para:</strong> {loggedUser.email}</p>
                <p><strong>Assunto:</strong> ðŸŽ‚ ParabÃ©ns pelo seu AniversÃ¡rio, {loggedUser.nome}! ðŸŽ‰</p>
                <hr className="border-purple-100" />
                <div className="space-y-2 text-slate-700 font-sans leading-relaxed">
                  <p>Estimado(a) condÃ³mino(a) <strong>{loggedUser.nome}</strong>,</p>
                  <p>Em nome de toda a equipa do <strong>CondoManager AI</strong> e da AdministraÃ§Ã£o do seu condomÃ­nio, desejamos-lhe um excelente dia de aniversÃ¡rio, repleto de felicidade, saÃºde e harmonia!</p>
                  <p>Agradecemos imenso por fazer parte da nossa comunidade residencial e por nos ajudar a tornar o nosso edifÃ­cio num lugar cada vez melhor para viver.</p>
                  <p>Muitos parabÃ©ns!</p>
                  <p className="text-[10px] text-slate-400 mt-4"><em>Nota: Esta mensagem foi gerada automaticamente pelo sistema com base na data de nascimento registrada no seu perfil de acesso.</em></p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBirthdayModalOpen(false);
                  alert("E-mail de aniversÃ¡rio disparado e entregue com sucesso!");
                }}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-md text-center"
              >
                Confirmar Envio AutomÃ¡tico Simulador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- WELCOME EMAIL SIMULATION DIALOG --- */}
      {welcomeMailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in border border-emerald-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-paper-plane text-emerald-400 text-lg"></i>
                <div>
                  <h3 className="font-bold text-sm uppercase">Simulador de E-mail de Boas-Vindas</h3>
                  <p className="text-[10px] text-slate-300">InstruÃ§Ãµes de portabilidade para novos condÃ³minos</p>
                </div>
              </div>
              <button onClick={() => setWelcomeMailModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 text-xs text-slate-800 space-y-3">
                <p><strong>De:</strong> portal@condomanager.pt</p>
                <p><strong>Para:</strong> {welcomeMailModal.fracao.proprietario.email}</p>
                <p><strong>Assunto:</strong> ðŸ  Bem-vindo ao CondoManager AI â€” Acesso ao Portal & PWA</p>
                <hr className="border-emerald-100" />
                <div className="space-y-2 text-slate-700 font-sans leading-relaxed">
                  <p>Estimado(a) <strong>{welcomeMailModal.fracao.proprietario.nome}</strong>,</p>
                  <p>Seja muito bem-vindo ao portal digital do prÃ©dio <strong>{predio.nome || "Ativo"}</strong>!</p>
                  <p>Para sua conveniÃªncia e conformidade regulatÃ³ria, a AdministraÃ§Ã£o criou a sua conta de acesso provisÃ³ria. Pode aceder ao seu portal em qualquer dispositivo mÃ³vel atravÃ©s da PWA com as seguintes credenciais:</p>
                  
                  <div className="bg-white border border-slate-200 p-3 rounded-lg font-mono-custom text-[11px] text-slate-800 space-y-1">
                    <p><strong>Link da PWA:</strong> https://condomanager-pwa.app/predio-1</p>
                    <p><strong>Utilizador:</strong> {welcomeMailModal.fracao.proprietario.email}</p>
                    <p className="text-indigo-600"><strong>Password ProvisÃ³ria:</strong> {welcomeMailModal.pass}</p>
                  </div>

                  <p className="text-red-500 font-semibold">InstruÃ§Ãµes Importantes:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                    <li>FaÃ§a login e altere a sua password imediatamente para garantir total seguranÃ§a biomÃ©trica.</li>
                    <li>Configure a autenticaÃ§Ã£o biomÃ©trica (FaceID/TouchID) para entrar num clique na PWA.</li>
                    <li>Consulte e liquide os seus Avisos & Quotas enviando o comprovativo para conciliaÃ§Ã£o automÃ¡tica por IA.</li>
                  </ul>
                  <p>Atenciosamente,<br /><strong>A AdministraÃ§Ã£o do CondomÃ­nio {predio.nome}</strong></p>
                </div>
              </div>
              <button
                onClick={() => {
                  setWelcomeMailModal(null);
                  alert(`E-mail de boas-vindas com password provisÃ³ria provida disparada com sucesso!`);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-md text-center"
              >
                Disparar E-mail de Boas-vindas Oficial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TouchID/FaceID Simulation Modal */}
      {biometricModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-6 animate-zoom-in">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full border border-slate-800 bg-[#070b19] flex items-center justify-center text-emerald-400 text-4xl relative overflow-hidden">
                <i className="fa-solid fa-fingerprint animate-pulse"></i>
                <div className="absolute inset-x-0 bottom-0 bg-emerald-500/20" style={{ height: `${biometricProgress}%` }}></div>
              </div>
              <h3 className="text-white font-bold text-sm mt-4 uppercase tracking-wider">Acesso BiomÃ©trico Seguro</h3>
              <p className="text-[10px] text-slate-400 mt-1">A digitalizar FaceID / TouchID...</p>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${biometricProgress}%` }}></div>
            </div>

            {biometricSuccess ? (
              <div className="text-emerald-400 text-xs font-bold flex items-center justify-center">
                <i className="fa-solid fa-circle-check mr-1.5 text-base"></i> Biometria Reconhecida!
              </div>
            ) : (
              <span className="text-slate-500 text-[10px]">Mantenha o dedo no leitor ou olhe para a cÃ¢mara</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}










