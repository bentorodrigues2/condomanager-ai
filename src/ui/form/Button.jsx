
export default function Button({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px 15px",
                background: "#4a6cf7",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
            }}
        >
            {children}
        </button>
    );
}
