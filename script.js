// script.js
(() => {
  const frameCount = 240;
  const frameFolder = 'frames/';
  const filePrefix = 'ezgif-frame-';
  const fileExt = '.png';
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const loadingEl = document.querySelector('.loading');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // set canvas size for high-DPI
  function setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  }
  setCanvasSize();
  window.addEventListener('resize', () => {
    setCanvasSize();
    if (images[currentFrameIndex]) drawFrame(currentFrameIndex);
  });

  // preload images
  const images = [];
  let loaded = 0;
  let currentFrameIndex = 0;

  function imgLoaded() {
    loaded++;
    if (loaded === frameCount) {
      if (loadingEl) loadingEl.style.display = 'none';
      initAnimation();
    }
  }

  if (prefersReduced) {
    const img = new Image();
    img.src = `${frameFolder}${filePrefix}001${fileExt}`;
    img.onload = () => {
      images[0] = img;
      if (loadingEl) loadingEl.style.display = 'none';
      drawFrame(0);
    };
  } else {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const number = String(i).padStart(3, '0');
      img.src = `${frameFolder}${filePrefix}${number}${fileExt}`;
      img.onload = imgLoaded;
      images[i - 1] = img;
    }
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img) return;
    currentFrameIndex = index;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    ctx.clearRect(0, 0, cw, ch);

    // Cover algorithm
    const imgRatio = img.width / img.height;
    const canvasRatio = cw / ch;
    let drawWidth, drawHeight, dx, dy;

    if (canvasRatio > imgRatio) {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
      dx = 0;
      dy = (ch - drawHeight) / 2;
    } else {
      drawWidth = ch * imgRatio;
      drawHeight = ch;
      dx = (cw - drawWidth) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }

  function initAnimation() {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.to({frame: 0}, {
      frame: frameCount - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: `+=${frameCount * 10}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: self => {
          const index = Math.round(self.progress * (frameCount - 1));
          drawFrame(index);
        }
      }
    });

    drawFrame(0);
  }

  // Geolocation button
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=Hotel+Nova+Inn+Dm+Road+Bulandshahr&travelmode=driving`;
          window.open(url, '_blank');
        }, () => {
          alert('Unable to retrieve your location. Directing to hotel map instead.');
          window.open('https://maps.app.goo.gl/pob6RU9vupPXoExG7', '_blank');
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  }
})();
