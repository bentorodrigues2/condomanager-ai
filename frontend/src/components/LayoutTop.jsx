import React from "react";
import "./LayoutTop.css";

export default function LayoutTop() {
  return (
    <div className="layout-top">

      {/* Imagem de fundo do layout */}
      <img
        src="/assets/layout.png"
        alt="Layout"
        className="layout-top-bg"
      />

      {/* Logotipo novo */}
      <div className="layout-top-logo">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="logo-img"
        />
      </div>

      {/* Vídeo */}
      <div className="layout-top-video">
        <video
          src="/video.mp4"
          autoPlay
          loop
          muted
        />
      </div>

    </div>
  );
}
