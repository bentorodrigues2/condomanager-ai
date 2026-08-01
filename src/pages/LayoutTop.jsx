import React from "react";
import { useNavigate } from "react-router-dom";
import "./LayoutTop.css";

export default function LayoutTop() {
  const navigate = useNavigate();

  return (
    <div className="layout-top-container">

      {/* BARRA SUPERIOR */}
      <div className="top-bar">
        <span className="condo-address">
          Rua Bento Rodrigues 2 - Paio Pires
        </span>

        <button
          className="area-pessoal-btn"
          onClick={() => navigate("/dashboard")}
        >
          Área Pessoal
        </button>
      </div>

      {/* SKYLINE */}
      <img src="/assets/skyline.png" alt="Skyline" className="skyline-img" />

      {/* LOGO */}
      <img src="/assets/logo.png" alt="Logo CondoManager" className="logo-img" />

      {/* VIDEO AO CENTRO */}
      <div className="video-frame">
        <video src="/videos/intro.mp4" autoPlay muted loop playsInline />
      </div>

    </div>
  );
}
