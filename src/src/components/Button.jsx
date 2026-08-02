
export default function Button({ children, onClick, color = 'var(--primary)' }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        border: 'none',
        width: '100%',
        marginTop: '1rem'
      }}
    >
      {children}
    </button>
  );
}
