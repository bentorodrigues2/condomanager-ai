import { theme } from '../../styles/theme';
import { ConfigSection } from '../configuracoes/ConfigSection';

const automacoes = [
  { nome: 'Alertas de atraso', tipo: 'Financeiro', estado: true },
  { nome: 'RevisÃ£o de faturas', tipo: 'Contabilidade', estado: false },
  { nome: 'GestÃ£o de manutenÃ§Ãµes', tipo: 'Operacional', estado: true },
];

export function IAAutomacoes() {
  return (
    <ConfigSection title="AutomaÃ§Ãµes" description="Ative ou desative fluxos automÃ¡ticos inteligentes.">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: theme.spacing.md }}>
        <button style={{ padding: '10px 16px', borderRadius: theme.radius.sm, border: 'none', background: theme.colors.primary, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          Criar AutomaÃ§Ã£o
        </button>
      </div>
      <div style={{ display: 'grid', gap: theme.spacing.md }}>
        {automacoes.map((item) => (
          <div key={item.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.colors.border}` }}>
            <div>
              <div style={{ fontWeight: 600, color: theme.colors.text }}>{item.nome}</div>
              <div style={{ color: theme.colors.textMuted, fontSize: '13px' }}>{item.tipo}</div>
            </div>
            <input type="checkbox" defaultChecked={item.estado} />
          </div>
        ))}
      </div>
    </ConfigSection>
  );
}








