import { Card } from '../dashboard/Card';
import { StatsGrid } from '../dashboard/StatsGrid';
import { theme } from '../../styles/theme';

export function IAResumo() {
  return (
    <div style={{ marginTop: theme.spacing.lg }}>
      <StatsGrid>
        <Card title="ConciliaÃ§Ãµes AutomÃ¡ticas" icon="ai-assistant">
          <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.text }}>24</div>
        </Card>
        <Card title="RelatÃ³rios Inteligentes" icon="analytics">
          <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.text }}>12</div>
        </Card>
        <Card title="PrevisÃµes Financeiras" icon="chart">
          <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.text }}>98%</div>
        </Card>
        <Card title="Alertas Inteligentes" icon="warning">
          <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.text }}>7</div>
        </Card>
      </StatsGrid>
    </div>
  );
}








