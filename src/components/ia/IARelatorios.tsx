import { theme } from '../../styles/theme';
import { ConfigSection } from '../configuracoes/ConfigSection';

const relatorios = [
  { data: '05/07/2026', tipo: 'Resumo Financeiro', estado: 'Gerado' },
  { data: '04/07/2026', tipo: 'Atividade de ManutenÃ§Ã£o', estado: 'Em revisÃ£o' },
  { data: '03/07/2026', tipo: 'AnÃ¡lise de CondomÃ­nios', estado: 'Agendado' },
];

export function IARelatorios() {
  return (
    <ConfigSection title="RelatÃ³rios AutomÃ¡ticos" description="RelatÃ³rios gerados automaticamente pelo sistema de IA.">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: theme.spacing.md }}>
        <button style={{ padding: '10px 16px', borderRadius: theme.radius.sm, border: 'none', background: theme.colors.primary, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          Gerar RelatÃ³rio
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theme.colors.surfaceAlt }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Data</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Tipo</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((item) => (
              <tr key={item.data} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: '12px 14px', color: theme.colors.text }}>{item.data}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.text }}>{item.tipo}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.textMuted }}>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConfigSection>
  );
}








