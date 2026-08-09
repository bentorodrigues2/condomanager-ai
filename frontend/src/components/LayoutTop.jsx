import React from "react";
import { useNavigate } from "react-router-dom";
import "./LayoutTop.css";

export default function LayoutTop() {
  const navigate = useNavigate();

  return (
    <div className="layout-top-container">
      <img src="/assets/skyline.png" alt="Skyline" className="skyline-img" />

      <img src="/assets/logo.png" alt="Logo CondoManager" className="logo-img" />

      <div className="video-frame">
        <video src="/assets/videos/intro.mp4" autoPlay muted loop />
      </div>

      <div className="overlay-info">
        <h2>CondoManager AI</h2>
        <p>PWA & Automação Ativa</p>

        <button
          className="area-pessoal-btn"
          onClick={() => navigate("/dashboard")}
        >
          Área Pessoal
        </button>
      </div>
    </div>
  );
}
