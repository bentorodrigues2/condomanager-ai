import { jsPDF } from "jspdf";

export const formatDatePT = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }
  return dateStr;
};

export const formatDateISO = (datePTStr: string | undefined): string => {
  if (!datePTStr) return "";
  const parts = datePTStr.split('-');
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return datePTStr;
  }
  return datePTStr;
};

export function downloadBlob(blob: Blob, fileName: string) {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (err) {
    console.error("Erro ao descarregar ficheiro:", err);
  }
}

export function exportToXLS(filename: string, headers: string[], rows: string[][]) {
  let csvContent = "\uFEFF"; // BOM for Portuguese characters
  csvContent += headers.join(";") + "\n";
  rows.forEach(row => {
    csvContent += row.map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(";") + "\n";
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const finalName = filename.endsWith(".xls") || filename.endsWith(".csv") ? filename : `${filename}.xls`;
  downloadBlob(blob, finalName);
}

export function generateAndDownloadPdf(
  title: string,
  sections: { heading?: string; content: string | string[] }[],
  fileName: string,
  metadata?: { label: string; value: string }[]
) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Header bar
    doc.setFillColor(4, 120, 87); // Emerald 700
    doc.rect(0, 0, 210, 24, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("CONDOMANAGER AI - DOCUMENTO OFICIAL", 14, 15);

    let y = 32;
    doc.setTextColor(15, 23, 42); // Slate 900

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(title, 180);
    doc.text(titleLines, 14, y);
    y += (titleLines.length * 6) + 4;

    // Metadata box
    if (metadata && metadata.length > 0) {
      const boxHeight = Math.max(18, Math.ceil(metadata.length / 2) * 6 + 4);
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, boxHeight, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, y, 182, boxHeight, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      let metaY = y + 5;
      metadata.forEach((m, idx) => {
        const xPos = idx % 2 === 0 ? 18 : 108;
        doc.text(`${m.label}: ${m.value}`, xPos, metaY);
        if (idx % 2 === 1 || idx === metadata.length - 1) metaY += 5.5;
      });
      y += boxHeight + 8;
    }

    // Body Sections
    for (const sec of sections) {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }

      if (sec.heading) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(4, 120, 87);
        doc.text(sec.heading, 14, y);
        y += 6;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);

      const items = Array.isArray(sec.content) ? sec.content : [sec.content];
      for (const item of items) {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }
        const lines = doc.splitTextToSize(item, 180);
        doc.text(lines, 14, y);
        y += (lines.length * 4.2) + 2;
      }
      y += 4;
    }

    // Footer
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(4, 120, 87);
    doc.line(14, y, 196, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text("CONDOMANAGER AI - REGISTO AUTÊNTICO E ARQUIVADO EM PDF", 105, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Emissão: ${new Date().toLocaleDateString('pt-PT')} | Certificado Digital Inviolável (Browser & PWA)`, 105, y + 4, { align: "center" });

    const finalPdfName = fileName.toLowerCase().endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    const blob = doc.output("blob");
    downloadBlob(blob, finalPdfName);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
  }
}

export function downloadDocHtml(title: string, htmlBody: string, fileName: string) {
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 30px; color: #0f172a; line-height: 1.5; }
    h1 { color: #047857; font-size: 18px; border-bottom: 2px solid #047857; padding-bottom: 6px; }
    p, li { font-size: 11px; }
  </style>
</head>
<body>
  ${fullHtmlBody(htmlBody)}
</body>
</html>`;
  const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
  const finalDocName = fileName.toLowerCase().endsWith(".doc") ? fileName : `${fileName}.doc`;
  downloadBlob(blob, finalDocName);
}

function fullHtmlBody(content: string): string {
  return content;
}

export function downloadEmailDocument(subject: string, from: string, to: string, bodyText: string, fileName: string) {
  const emlContent = `From: ${from}
To: ${to}
Subject: ${subject}
Date: ${new Date().toUTCString()}
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8

${bodyText}
`;
  const blob = new Blob([emlContent], { type: 'text/plain;charset=utf-8;' });
  const finalName = fileName.toLowerCase().endsWith(".eml") ? fileName : `${fileName}.eml`;
  downloadBlob(blob, finalName);
}

export function computeTransferCode(morada: string | undefined, numPorta: string | undefined, piso: string | undefined, fracao_nome: string | undefined): string {
  if (!morada) return "CONDOMINIO";
  const palavras = morada.split(/[\s,]+/);
  const ignorarArtigos = ["de", "do", "dos", "da", "das", "a", "o", "e"];
  const palavrasFiltradas = palavras.filter(p => p && !ignorarArtigos.includes(p.toLowerCase()));
  
  // Take initials of up to 2 words of the street (e.g., "Rua Bento" -> RB)
  const iniciais = palavrasFiltradas
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join("");
  
  const num = (numPorta || "").trim().replace(/[^0-9]/g, "");
  const p = (piso || "").trim().replace(/[^a-zA-Z0-9]/g, "");
  const f = (fracao_nome || "").trim().replace(/[^a-zA-Z0-9]/g, "");
  
  return `${iniciais}${num}${p}${f}`.toUpperCase();
}

export function copyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    return false;
  }
}
