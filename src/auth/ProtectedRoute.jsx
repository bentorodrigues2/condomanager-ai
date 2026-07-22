
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowed }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (!allowed.includes(user.role)) return <Navigate to="/area-pessoal" replace />;

    return children;
}
