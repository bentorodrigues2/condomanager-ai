import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

export function Section({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <section style={{ marginTop: theme.spacing.xl }}>
      <div style={{ marginBottom: theme.spacing.md }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: theme.colors.text }}>{title}</h2>
        {description ? <p style={{ marginTop: '4px', color: theme.colors.textMuted }}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}








