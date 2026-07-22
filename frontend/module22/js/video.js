
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('main-video');

    video.onerror = () => {
        console.warn('Falha ao carregar o vídeo. Aplicando fallback.');
        document.getElementById('video-container').innerHTML =
            '<div style="color:white;padding:20px;text-align:center;">Vídeo indisponível</div>';
    };
});
