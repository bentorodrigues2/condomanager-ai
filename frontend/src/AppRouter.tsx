
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h2>Dashboard</h2>} />
        <Route path="/dashboard" element={<h2>Dashboard</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
