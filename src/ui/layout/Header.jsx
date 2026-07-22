
import { useAuth } from "../../auth/AuthContext";
import ThemeToggle from "../theme/ThemeToggle";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: "60px",
            background: "#fff",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px"
        }}>
            <h3>Painel</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ThemeToggle />
                <span>
                    {user?.role}
                </span>
                <button onClick={logout}>Sair</button>
            </div>
        </header>
    );
}
