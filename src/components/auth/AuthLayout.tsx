import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

export function AuthLayout({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.colors.background, padding: theme.spacing.lg }}>
      <div style={{ width: '100%', maxWidth: '440px', background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadows.md, padding: theme.spacing.xl }}>
        <div style={{ marginBottom: theme.spacing.lg }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: theme.colors.text }}>{title}</h1>
          {description ? <p style={{ marginTop: '8px', color: theme.colors.textMuted }}>{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}








