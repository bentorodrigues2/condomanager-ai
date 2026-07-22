import { theme } from '../../styles/theme';

export function AuthButton({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: theme.radius.sm,
        border: 'none',
        background: theme.colors.primary,
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {text}
    </button>
  );
}








