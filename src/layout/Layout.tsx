import React from "react";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  console.log("✅ Layout renderizado — a mostrar conteúdo interno.");
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, background: '#f1f5f9' }}>
        <header style={{ background: '#1e293b', color: 'white', padding: '10px' }}>
          <h1>CondoManager AI</h1>
        </header>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
