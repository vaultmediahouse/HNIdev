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
  window.addEventListener('resize', setCanvasSize);

  // preload images
  const images = [];
  let loaded = 0;
  function imgLoaded() {
    loaded++;
    if (loaded === frameCount) {
      loadingEl.style.display = 'none';
      initAnimation();
    }
  }
  if (prefersReduced) {
    // load only first frame
    const img = new Image();
    img.src = `${frameFolder}${filePrefix}001${fileExt}`;
    img.onload = () => {
      images[0] = img;
      loadingEl.style.display = 'none';
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw centered
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    const iw = img.width;
    const ih = img.height;
    const dx = (cw - iw) / 2;
    const dy = (ch - ih) / 2;
    ctx.drawImage(img, dx, dy, iw, ih);
  }

  function initAnimation() {
    gsap.to({frame:0}, {
      frame: frameCount - 1,
      ease: 'none',
      onUpdate: function() {
        drawFrame(Math.round(this.targets()[0].frame));
      },
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: `+=${frameCount * 5}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
    // draw first frame initially
    drawFrame(0);
  }
  // Geolocation button
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          const dest = encodeURIComponent('Hotel Nova Inn Dm Road Bulandshahr');
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${dest}&travelmode=driving`;
          window.open(url, '_blank');
        }, err => {
          alert('Unable to retrieve your location.');
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  }
})();
