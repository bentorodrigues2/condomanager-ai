
import { useAuth } from "../auth/AuthContext";

export default function AreaPessoal() {
    const { user } = useAuth();
    return <h1>Área Pessoal — Perfil: {user?.role}</h1>;
}
