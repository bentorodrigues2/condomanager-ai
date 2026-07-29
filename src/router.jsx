import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ContabilidadeDashboard from "./pages/ContabilidadeDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard principal */}
        <Route path="/" element={<Dashboard />} />

        {/* Contabilidade */}
        <Route
          path="/contabilidade"
          element={
            <ProtectedRoute>
              <ContabilidadeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<div style={{ padding: "2rem" }}>Página não encontrada</div>} />

      </Routes>
    </BrowserRouter>
  );
}
