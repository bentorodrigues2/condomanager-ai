import React from "react";
import "./LayoutTop.css";
import VideoFrame from "./VideoFrame";

export default function LayoutTop() {
  return (
    <div className="layout-top">
      {/* Skyline */}
      <img
        src="/assets/skyline.png"
        alt="Skyline"
        className="layout-top-bg"
      />

      {/* Morada + Botão */}
      <div className="layout-top-overlay">
        <p className="condo-text">
          Condominio - R. Bento Rodrigues 2, Aldeia de Paio Pires
        </p>

        <button
          className="area-pessoal-btn"
          onClick={() => (window.location.href = "/login")}
        >
          Área Pessoal
        </button>
      </div>

      {/* Vídeo */}
      <div className="layout-top-video">
        <VideoFrame />
      </div>
    </div>
  );
}
