
export default function Input({ label, value, onChange }) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <label>{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                }}
            />
        </div>
    );
}
