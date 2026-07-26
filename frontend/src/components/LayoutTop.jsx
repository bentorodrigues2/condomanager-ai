import { useState } from "react";
import "./LayoutTop.css";
import skyline from "../assets/skyline.png";
import logo from "../assets/Logo.png";
import VideoFrame from "./VideoFrame";

export default function LayoutTop() {
  const [areaAtiva, setAreaAtiva] = useState(false);

  return (
    <div className="layout-top-container">

      {/* SKYLINE */}
      <img src={skyline} className="skyline-img" alt="Skyline" />

      {/* LOGOTIPO */}
      <img src={logo} className="logo-img" alt="Logo" />

      {/* VIDEO */}
      <div className="video-frame">
        <VideoFrame />
      </div>

      {/* OVERLAY */}
      <div className="overlay-info">
        <p>Rua do Condomínio, Nº 12 — Seixal</p>

        {/* BOTÃO EFETUAR MOVIMENTO */}
        <button
          className="movimento-btn"
          onClick={() => setAreaAtiva(true)}
        >
          Efetuar Movimento
        </button>

        {/* BOTÃO ÁREA PESSOAL — SEMPRE VISÍVEL */}
        <button
          className="area-pessoal-btn"
          onClick={() => {
            if (areaAtiva) {
              window.location.href = "/login";
            }
          }}
        >
          Área Pessoal
        </button>
      </div>
    </div>
  );
}
