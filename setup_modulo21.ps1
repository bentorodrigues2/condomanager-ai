Write-Host "Iniciando Modulo 21..."

# Criar pasta assets
$assetsPath = "frontend/src/assets"
if (!(Test-Path $assetsPath)) {
    New-Item -ItemType Directory -Path $assetsPath | Out-Null
    Write-Host "Pasta assets criada."
} else {
    Write-Host "Pasta assets ja existe."
}

# Copiar imagem skyline
if (Test-Path ".\skyline.png") {
    Copy-Item ".\skyline.png" "$assetsPath\skyline.png" -Force
    Write-Host "Imagem skyline copiada."
} else {
    Write-Host "ATENCAO: skyline.png nao esta na raiz!"
}

# Criar LayoutTop.jsx linha a linha
$jsxPath = "frontend/src/components/LayoutTop.jsx"
$jsxContent = @(
'import React from "react";'
'import "./LayoutTop.css";'
'import skyline from "../../assets/skyline.png";'
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
''
'      <div className="video-container">'
'        <video src="/intro.mp4" autoPlay muted loop />'
'      </div>'
'    </div>'
'  );'
'}'
)
Set-Content -Path $jsxPath -Value $jsxContent -Force
Write-Host "LayoutTop.jsx criado."

# Criar LayoutTop.css linha a linha
$cssPath = "frontend/src/components/LayoutTop.css"
$cssContent = @(
'.layout-top {'
'  position: relative;'
'  width: 100%;'
'  height: 420px;'
'  overflow: hidden;'
'}'
''
'.layout-top-bg {'
'  width: 100%;'
'  height: 100%;'
'  object-fit: cover;'
'  filter: brightness(0.55);'
'}'
''
'.layout-top-overlay {'
'  position: absolute;'
'  inset: 0;'
'  display: flex;'
'  justify-content: space-between;'
'  align-items: center;'
'  padding: 25px 40px;'
'  color: white;'
'}'
''
'.layout-top-center {'
'  text-align: center;'
'}'
''
'.area-pessoal-btn {'
'  background-color: #00c853;'
'  padding: 10px 22px;'
'  border-radius: 6px;'
'  border: none;'
'  font-size: 16px;'
'  cursor: pointer;'
'}'
''
'.video-container {'
'  width: 100%;'
'  max-height: 480px;'
'  overflow: hidden;'
'}'
''
'.video-container video {'
'  width: 100%;'
'  height: auto;'
'  display: block;'
'}'
)
Set-Content -Path $cssPath -Value $cssContent -Force
Write-Host "LayoutTop.css criado."

# Git commit + push
Write-Host "Commit e push..."
git add .
git commit -m "Modulo 21: LayoutTop + skyline + video integrado automaticamente"
git push

Write-Host "Modulo 21 concluido."
