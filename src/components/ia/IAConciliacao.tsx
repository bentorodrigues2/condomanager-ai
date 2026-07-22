import { theme } from '../../styles/theme';
import { ConfigSection } from '../configuracoes/ConfigSection';

const conciliar = [
  { data: '05/07/2026', origem: 'Faturas', resultado: 'Conciliado', confianca: 'Alta' },
  { data: '04/07/2026', origem: 'Movimentos bancÃ¡rios', resultado: 'Parcial', confianca: 'MÃ©dia' },
  { data: '03/07/2026', origem: 'Pagamentos', resultado: 'Pendente', confianca: 'Baixa' },
];

function getConfidenceStyle(conf: string) {
  if (conf === 'Alta') return { background: '#dcfce7', color: '#166534' };
  if (conf === 'MÃ©dia') return { background: '#fef3c7', color: '#92400e' };
  return { background: '#fee2e2', color: '#b91c1c' };
}

export function IAConciliacao() {
  return (
    <ConfigSection title="ConciliaÃ§Ãµes AutomÃ¡ticas" description="Resultados das conciliaÃ§Ãµes inteligentes geradas pelo sistema.">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theme.colors.surfaceAlt }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Data</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Origem</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>Resultado</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.colors.textMuted, fontSize: '13px', fontWeight: 700 }}>ConfianÃ§a</th>
            </tr>
          </thead>
          <tbody>
            {conciliar.map((item) => (
              <tr key={item.data} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: '12px 14px', color: theme.colors.text }}>{item.data}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.text }}>{item.origem}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.text }}>{item.resultado}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, ...getConfidenceStyle(item.confianca) }}>{item.confianca}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConfigSection>
  );
}








