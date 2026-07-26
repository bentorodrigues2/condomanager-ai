import React from "react";
import "./LayoutTop.css";

export default function LayoutTop() {
  return (
    <div className="layout-top">

      {/* Skyline original */}
      <img
        src="/assets/skyline.png"
        alt="Skyline"
        className="layout-top-bg"
      />

      {/* Logotipo original */}
      <div className="layout-top-logo">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="logo-img"
        />
      </div>

      {/* Vídeo original centrado */}
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
