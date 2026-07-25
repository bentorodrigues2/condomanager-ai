import React from "react";
import "./LayoutTop.css";
import VideoFrame from "./VideoFrame";

export default function LayoutTop() {
  return (
    <div className="layout-top">
      {/* Skyline com logotipo incorporado */}
      <img
        src="/assets/skyline.png"
        alt="Skyline"
        className="layout-top-bg"
      />

      {/* Texto e botão */}
      <div className="layout-top-overlay">
        <p className="condo-text">
          Condominio - R. Bento Rodrigues 2, Aldeia de Paio Pires
        </p>

        <button className="area-pessoal-btn">Área Pessoal</button>
      </div>

      {/* Vídeo centrado */}
      <div className="layout-top-video">
        <VideoFrame />
      </div>
    </div>
  );
}
