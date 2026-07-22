import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

export function StatsGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: theme.spacing.lg,
      }}
    >
      {children}
    </div>
  );
}








