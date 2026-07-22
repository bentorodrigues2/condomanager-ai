
export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '1rem',
        width: '100%',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}
    />
  );
}
