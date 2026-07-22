const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module22');

// Create folders
fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });
fs.mkdirSync(path.join(base, 'assets'), { recursive: true });

// HTML
const html = `
<div id="video-wrapper">
    <div id="video-container">
        <video id="main-video" width="960" height="540" controls>
            <source src="assets/video.mp4" type="video/mp4">
            O seu navegador não suporta vídeo HTML5.
        </video>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'video-container.html'), html);

// CSS
const css = `
#video-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

#video-container {
    width: 960px;
    max-width: 100%;
    aspect-ratio: 16 / 9;
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
}

#main-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
`;

fs.writeFileSync(path.join(base, 'css', 'video.css'), css);

// JS
const js = `
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('main-video');

    video.onerror = () => {
        console.warn('Falha ao carregar o vídeo. Aplicando fallback.');
        document.getElementById('video-container').innerHTML =
            '<div style="color:white;padding:20px;text-align:center;">Vídeo indisponível</div>';
    };
});
`;

fs.writeFileSync(path.join(base, 'js', 'video.js'), js);

// Inject into index.html
const indexPath = path.join(__dirname, 'frontend', 'index.html');
if (fs.existsSync(indexPath)) {
    let index = fs.readFileSync(indexPath, 'utf8');

    if (!index.includes('video-wrapper')) {
        index = index.replace('</body>', `
<!-- Módulo 22 - Vídeo -->
<link rel="stylesheet" href="module22/css/video.css">
<script src="module22/js/video.js"></script>
${html}
</body>
`);
        fs.writeFileSync(indexPath, index);
        console.log('Módulo 22 integrado no index.html');
    } else {
        console.log('Módulo 22 já estava integrado.');
    }
}

console.log('Módulo 22 criado com sucesso.');
