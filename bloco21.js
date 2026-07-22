import fs from "fs";
import path from "path";

const baseDir = path.resolve("./src");
const componentsDir = path.join(baseDir, "components");

fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(componentsDir, { recursive: true });

const appContent = `
import Header from './components/Header';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <VideoSection />
      <Footer />
    </div>
  );
}

export default App;
`;

const headerContent = `
export default function Header() {
  return (
    <header className="header">
      <span className="header-text">Gestão de Condominio Rua B.Rodrigues, 2 Paio Pires</span>
      <button className="area-pessoal">Área Pessoal</button>
    </header>
  );
}
`;

const videoSectionContent = `
export default function VideoSection() {
  return (
    <section className="video-section">
      <div className="logo">
        <img src="/logo-condomanager.png" alt="CondoManager AI" />
        <h1>CondoManager <span className="ai">AI</span></h1>
        <p className="subtitle">PMA & Automação Ativa</p>
      </div>
      <div className="video-placeholder">
        <img src="/video-placeholder.png" alt="Vídeo CondoManager AI" />
      </div>
    </section>
  );
}
`;

const footerContent = `
export default function Footer() {
  return (
    <footer className="footer">
      <div className="skyline"></div>
    </footer>
  );
}
`;

const stylesContent = `
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #0b1622;
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: rgba(0, 0, 0, 0.6);
}

.header-text {
  color: #ccc;
  font-size: 14px;
}

.area-pessoal {
  background-color: #0056b3; /* azul institucional */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.video-section {
  text-align: center;
  margin-top: 60px;
}

.logo img {
  width: 80px;
}

.ai {
  color: #00b37e;
}

.video-placeholder img {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  margin-top: 20px;
}

.footer {
  position: relative;
  height: 120px;
  background: url('/skyline.png') bottom center no-repeat;
  background-size: cover;
}
`;

const mainContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(baseDir, "App.jsx"), appContent);
fs.writeFileSync(path.join(componentsDir, "Header.jsx"), headerContent);
fs.writeFileSync(path.join(componentsDir, "VideoSection.jsx"), videoSectionContent);
fs.writeFileSync(path.join(componentsDir, "Footer.jsx"), footerContent);
fs.writeFileSync(path.join(baseDir, "styles.css"), stylesContent);
fs.writeFileSync(path.join(baseDir, "main.jsx"), mainContent);

console.log("✅ Bloco 21 criado com sucesso! Layout estático final pronto para validação.");
