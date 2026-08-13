
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <main style={{ padding: "20px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
