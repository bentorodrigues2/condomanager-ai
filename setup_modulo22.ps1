Write-Host "Iniciando Modulo 22..."

# Criar componente VideoFrame.jsx
$videoPath = "frontend/src/components/VideoFrame.jsx"
$videoContent = @(
'import React from "react";'
'import "./VideoFrame.css";'
''
'export default function VideoFrame() {'
'  return ('
'    <div className="video-frame">'
'      <div className="video-wrapper">'
'        <video'
'          src="/intro.mp4"'
'          autoPlay'
'          muted'
'          loop'
'          playsInline'
'        />'
'      </div>'
'    </div>'
'  );'
'}'
)
Set-Content -Path $videoPath -Value $videoContent -Force
Write-Host "VideoFrame.jsx criado."

# Criar CSS VideoFrame.css
$cssVideoPath = "frontend/src/components/VideoFrame.css"
$cssVideoContent = @(
'.video-frame {'
'  width: 100%;'
'  display: flex;'
'  justify-content: center;'
'  margin-top: 20px;'
'}'
''
'.video-wrapper {'
'  width: 960px;'
'  max-width: 100%;'
'  aspect-ratio: 16 / 9;'
'  overflow: hidden;'
'  border-radius: 12px;'
'  background-color: black;'
'}'
''
'.video-wrapper video {'
'  width: 100%;'
'  height: 100%;'
'  object-fit: cover;'
'}'
)
Set-Content -Path $cssVideoPath -Value $cssVideoContent -Force
Write-Host "VideoFrame.css criado."

# Atualizar LayoutTop.jsx para integrar o video
$layoutPath = "frontend/src/components/LayoutTop.jsx"
$layoutContent = @(
'import React from "react";'
'import "./LayoutTop.css";'
'import skyline from "../../assets/skyline.png";'
'import VideoFrame from "./VideoFrame";'
''
'export default function LayoutTop() {'
'  return ('
'    <div className="layout-top">'
'      <img src={skyline} alt="Skyline" className="layout-top-bg" />'
''
'      <div className="layout-top-overlay">'
'        <div className="layout-top-left">'
'          <h3>Condominio de R. Bento Rodrigues, 2 - Paio Pires</h3>'
'        </div>'
''
'        <div className="layout-top-center">'
'          <img src="/logo.png" className="logo" />'
'          <h1>CondoManager AI</h1>'
'          <p>PWA e Automacao Ativa</p>'
'        </div>'
''
'        <div className="layout-top-right">'
'          <button className="area-pessoal-btn">Area Pessoal</button>'
'        </div>'
'      </div>'
'    </div>'
'  );'
'}'
''
'// Integracao do video abaixo da moldura'
'export function LayoutTopWithVideo() {'
'  return ('
'    <div>'
'      <LayoutTop />'
'      <VideoFrame />'
'    </div>'
'  );'
'}'
)
Set-Content -Path $layoutPath -Value $layoutContent -Force
Write-Host "LayoutTop.jsx atualizado com integracao do video."

# Git commit + push
git add .
git commit -m "Modulo 22: Integracao do video com moldura responsiva"
git push

Write-Host "Modulo 22 concluido."
