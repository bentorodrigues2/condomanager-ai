
export function verificarPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      console.log('PWA ativa e pronta');
    });
  } else {
    console.warn('Service Worker não encontrado');
  }

  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App instalada como PWA');
  } else {
    console.log('App ainda não instalada');
  }
}
