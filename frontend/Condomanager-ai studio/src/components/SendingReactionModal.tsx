import React, { useState, useEffect } from "react";

interface SendingReactionModalProps {
  isOpen: boolean;
  type: "email" | "mensagem";
  onComplete?: () => void;
  title?: string;
}

export const SendingReactionModal: React.FC<SendingReactionModalProps> = ({
  isOpen,
  type,
  onComplete,
  title
}) => {
  const [phase, setPhase] = useState<"sending" | "success">("sending");

  useEffect(() => {
    if (isOpen) {
      setPhase("sending");
      const timer1 = setTimeout(() => {
        setPhase("success");
      }, 1500);

      const timer2 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const htmlSrc = phase === "sending"
    ? "/icons/a-enviar.html"
    : type === "email"
    ? "/icons/email-enviado-sucesso.html"
    : "/icons/mensagem-enviada-sucesso.html";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm flex flex-col items-center p-6 text-center text-white">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">
          {title || (phase === "sending" ? "A Processar Envio..." : type === "email" ? "E-mail Enviado" : "Mensagem Enviada")}
        </h4>
        
        <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 mb-4 relative">
          <iframe 
            src={htmlSrc} 
            className="w-full h-full border-0" 
            title="Reação Envio"
          />
        </div>

        <p className="text-xs text-slate-400 font-medium">
          {phase === "sending" 
            ? "A comunicar com os servidores e canais de notificação..." 
            : type === "email"
            ? "E-mail entregue com sucesso aos destinatários."
            : "Mensagem entregue no canal interno do condómino."
          }
        </p>
      </div>
    </div>
  );
};
