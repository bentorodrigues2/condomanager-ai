import { theme } from '../../styles/theme';

export function AuthInput({ label, type = 'text', placeholder, value, onChange }: { label: string; type?: string; placeholder?: string; value?: string; onChange?: (e: any) => void }) {
  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: theme.colors.textMuted, marginBottom: '6px' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width: '100%', padding: '12px 14px', borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, background: theme.colors.surfaceAlt, color: theme.colors.text }}
      />
    </div>
  );
}








