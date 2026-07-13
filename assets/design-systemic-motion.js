(() => {
  'use strict';

  const roots = document.querySelectorAll('.design-systemic-image');
  if (!roots.length) return;

  const clampDpr = () => Math.min(window.devicePixelRatio || 1, 2);

  const curves = [
    [[0.08,0.72],[0.30,0.63],[0.54,0.31],[0.92,0.16]],
    [[0.08,0.31],[0.35,0.38],[0.57,0.66],[0.92,0.78]],
    [[0.12,0.58],[0.36,0.46],[0.61,0.29],[0.90,0.34]],
    [[0.14,0.82],[0.38,0.61],[0.58,0.40],[0.88,0.20]],
    [[0.16,0.22],[0.36,0.31],[0.62,0.55],[0.88,0.69]],
    [[0.20,0.67],[0.40,0.53],[0.67,0.46],[0.91,0.43]]
  ];

  const cubicPoint = (curve, t) => {
    const [p0,p1,p2,p3] = curve;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    return {
      x: mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
      y: mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1]
    };
  };

  roots.forEach((root, rootIndex) => {
    const canvas = root.querySelector('.design-systemic-image__motion');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let cssW = 1;
    let cssH = 1;
    let dpr = clampDpr();
    let raf = 0;
    let visible = true;

    const particles = Array.from({ length: 12 }, (_, i) => ({
      curve: curves[i % curves.length],
      phase: (i / 12 + rootIndex * 0.07) % 1,
      speed: 0.018 + (i % 4) * 0.0035,
      radius: i % 3 === 0 ? 3.4 : 2.2,
      alpha: i % 3 === 0 ? 0.95 : 0.72,
      trail: i % 2 === 0 ? 0.055 : 0.035
    }));

    const resize = () => {
      const rect = root.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      dpr = clampDpr();
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawParticle = (particle, time) => {
      const t = (particle.phase + time * particle.speed) % 1;
      const p = cubicPoint(particle.curve, t);
      const headX = p.x * cssW;
      const headY = p.y * cssH;

      const trailPoints = [];
      for (let s = 8; s >= 1; s--) {
        const tt = (t - particle.trail * (s / 8) + 1) % 1;
        const tp = cubicPoint(particle.curve, tt);
        trailPoints.push({ x: tp.x * cssW, y: tp.y * cssH, a: (9 - s) / 9 });
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      trailPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = 'rgba(247,244,236,0.38)';
      ctx.lineWidth = particle.radius * 0.72;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(247,244,236,0.45)';
      ctx.stroke();

      const glow = ctx.createRadialGradient(headX, headY, 0, headX, headY, particle.radius * 4.8);
      glow.addColorStop(0, `rgba(255,253,246,${particle.alpha})`);
      glow.addColorStop(0.25, `rgba(247,244,236,${particle.alpha * 0.68})`);
      glow.addColorStop(1, 'rgba(247,244,236,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(headX, headY, particle.radius * 4.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,253,246,${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(headX, headY, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const frame = (ms) => {
      if (!visible) return;
      ctx.clearRect(0, 0, cssW, cssH);
      const t = ms / 1000;
      particles.forEach((particle) => drawParticle(particle, t));
      raf = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    const visibilityObserver = new IntersectionObserver((entries) => {
      const nextVisible = entries.some((entry) => entry.isIntersecting);
      if (nextVisible && !visible) {
        visible = true;
        raf = requestAnimationFrame(frame);
      } else if (!nextVisible && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    }, { rootMargin: '150px' });
    visibilityObserver.observe(root);

    raf = requestAnimationFrame(frame);
  });
})();
