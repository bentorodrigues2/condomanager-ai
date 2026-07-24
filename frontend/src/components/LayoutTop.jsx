import React from "react";
import "./LayoutTop.css";
import skyline from "../../assets/skyline.png";

export default function LayoutTop() {
  return (
    <div className="layout-top">
      <img src={skyline} alt="Skyline" className="layout-top-bg" />

      <div className="layout-top-overlay">
        <div className="layout-top-left">
          <h3>Condominio de R. Bento Rodrigues, 2 - Paio Pires</h3>
        </div>

        <div className="layout-top-center">
          <img src="/logo.png" className="logo" />
          <h1>CondoManager AI</h1>
          <p>PWA e Automacao Ativa</p>
        </div>

        <div className="layout-top-right">
          <button className="area-pessoal-btn">Area Pessoal</button>
        </div>
      </div>

      <div className="video-container">
        <video src="/intro.mp4" autoPlay muted loop />
      </div>
    </div>
  );
}
