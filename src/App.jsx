
import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./ui/layout/Layout";

export default function App() {
    return (
        <AuthProvider>
            <Layout>
                <AppRouter />
            </Layout>
        </AuthProvider>
    );
}
