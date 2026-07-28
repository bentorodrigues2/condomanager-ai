import { useAuth } from "../auth/AuthContext";
import { fakeLogin } from "../api/auth";
import { ROLES } from "../auth/roles";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const redirectMap = {
        admin: "/admin",
        gestor: "/gestor",
        condomino: "/condomino",
        fornecedor: "/fornecedor",
        limpezas: "/limpezas",
        auditor: "/auditor",
        contabilidade: "/contabilidade"
    };

    const handleLogin = async (role) => {
        const res = await fakeLogin(role);
        login(res.role);
        navigate(redirectMap[role]);
    };

    return (
        <div>
            <h1>Login</h1>
            {Object.values(ROLES).map((r) => (
                <button key={r} onClick={() => handleLogin(r)}>
                    Entrar como {r}
                </button>
            ))}
        </div>
    );
}
