import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import { theme } from '../../styles/theme';

export function Card({ title, icon, children }: { title: string; icon?: string; children?: ReactNode }) {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.sm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
        {icon ? <Icon name={icon} size={20} /> : null}
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.text }}>{title}</h3>
      </div>
      <div style={{ color: theme.colors.textMuted }}>{children}</div>
    </div>
  );
}








