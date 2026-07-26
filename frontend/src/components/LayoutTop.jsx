import React from "react";
import "./LayoutTop.css";

export default function LayoutTop() {
  return (
    <div className="layout-top">

      {/* Imagem de fundo (skyline) */}
      <img
        src="/assets/skyline.png"
        alt="Skyline"
        className="layout-top-bg"
      />

      {/* Logotipo */}
      <div className="layout-top-logo">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="logo-img"
        />
      </div>

      {/* Vídeo de introdução */}
      <div className="layout-top-video">
        <video
          src="/assets/videos/intro.mp4"
          autoPlay
          loop
          muted
        />
      </div>

    </div>
  );
}
