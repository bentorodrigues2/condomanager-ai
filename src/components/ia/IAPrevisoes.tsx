import { theme } from '../../styles/theme';
import { ConfigSection } from '../configuracoes/ConfigSection';

export function IAPrevisoes() {
  return (
    <ConfigSection title="PrevisÃµes Financeiras" description="AnÃ¡lises e previsÃµes geradas automaticamente pela IA.">
      <div style={{ display: 'grid', gap: theme.spacing.lg, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ padding: theme.spacing.lg, borderRadius: theme.radius.md, background: theme.colors.surfaceAlt, border: `1px solid ${theme.colors.border}` }}>
          <div style={{ fontWeight: 700, color: theme.colors.text }}>ProjeÃ§Ã£o de Caixa</div>
          <div style={{ marginTop: theme.spacing.sm, color: theme.colors.textMuted }}>Expectativa de saldo: â‚¬ 6.300 no prÃ³ximo trimestre.</div>
        </div>
        <div style={{ padding: theme.spacing.lg, borderRadius: theme.radius.md, background: theme.colors.surfaceAlt, border: `1px solid ${theme.colors.border}` }}>
          <div style={{ fontWeight: 700, color: theme.colors.text }}>AnÃ¡lise de Risco</div>
          <div style={{ marginTop: theme.spacing.sm, color: theme.colors.textMuted }}>Risco de inadimplÃªncia moderado devido a 2 pagamentos em atraso.</div>
        </div>
        <div style={{ padding: theme.spacing.lg, borderRadius: theme.radius.md, background: theme.colors.surfaceAlt, border: `1px solid ${theme.colors.border}` }}>
          <div style={{ fontWeight: 700, color: theme.colors.text }}>GrÃ¡fico Mock</div>
          <div style={{ marginTop: theme.spacing.sm, height: '120px', borderRadius: theme.radius.sm, background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', opacity: 0.9 }} />
        </div>
      </div>
    </ConfigSection>
  );
}








