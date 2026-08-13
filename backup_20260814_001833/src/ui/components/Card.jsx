
export default function Card({ title, children }) {
    return (
        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            marginBottom: "20px"
        }}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
}
