import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ExportPdfButton: React.FC<ExportButtonProps> = ({ className, ...props }) => (
  <button
    {...props}
    type="button"
    title="Exportar PDF"
    className={`p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs active:scale-95 ${className || ""}`}
  >
    <FileText className="h-5 w-5" />
  </button>
);

export const ExportExcelButton: React.FC<ExportButtonProps> = ({ className, ...props }) => (
  <button
    {...props}
    type="button"
    title="Exportar Excel"
    className={`p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs active:scale-95 ${className || ""}`}
  >
    <FileSpreadsheet className="h-5 w-5" />
  </button>
);
