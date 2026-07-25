import React from "react";
import "./LayoutTop.css";
import VideoFrame from "./VideoFrame";

export default function LayoutTop() {
  return (
    <div className="layout-top">
      {/* Imagem de fundo servida diretamente da pasta public */}
      <img
        src="/assets/skyline.png"
        alt="Skyline"
        className="layout-top-bg"
      />

      <div className="layout-top-overlay">
        <div className="layout-top-left">
          <h3>Condominio de R. Bento Rodrigues, 2 - Paio Pires</h3>
        </div>

        <div className="layout-top-center">
          <img src="/logo.png" className="logo" alt="Logo" />
          <h1>CondoManager AI</h1>
          <p>PWA e Automacao Ativa</p>
        </div>

        <div className="layout-top-right">
          <button className="area-pessoal-btn">Area Pessoal</button>
        </div>
      </div>
    </div>
  );
}

export function LayoutTopWithVideo() {
  return (
    <div>
      <LayoutTop />
      <VideoFrame />
    </div>
  );
}
