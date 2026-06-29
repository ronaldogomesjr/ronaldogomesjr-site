(function () {
  const canvases = document.querySelectorAll('[data-network-canvas]');
  if (!canvases.length) return;

  const palette = [
    { stroke: 'rgba(36, 95, 107, 0.78)', fill: 'rgba(36, 95, 107, 0.86)' },
    { stroke: 'rgba(135, 149, 121, 0.70)', fill: 'rgba(135, 149, 121, 0.78)' },
    { stroke: 'rgba(199, 159, 105, 0.74)', fill: 'rgba(199, 159, 105, 0.82)' },
    { stroke: 'rgba(33, 34, 36, 0.54)', fill: 'rgba(33, 34, 36, 0.66)' },
    { stroke: 'rgba(160, 165, 158, 0.62)', fill: 'rgba(160, 165, 158, 0.66)' }
  ];

  function createNode(width, height, index) {
    const color = palette[index % palette.length];
    const margin = 44;
    const hollow = index % 4 === 0 || index % 7 === 0;
    const large = index % 9 === 0;
    const radius = large ? 13 + Math.random() * 10 : 2.5 + Math.random() * 6;

    return {
      x: margin + Math.random() * Math.max(1, width - margin * 2),
      y: margin + Math.random() * Math.max(1, height - margin * 2),
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      ax: (Math.random() - 0.5) * 0.002,
      ay: (Math.random() - 0.5) * 0.002,
      radius,
      phase: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.004,
      color,
      hollow,
      large
    };
  }

  function setup(canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let raf = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(320, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 520 ? 26 : 44;
      nodes = Array.from({ length: count }, (_, index) => createNode(width, height, index));
    }

    function curveBetween(a, b, strength) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / distance;
      const ny = dx / distance;
      const bow = Math.sin((a.phase + b.phase) * 0.7) * strength;
      return {
        cx: (a.x + b.x) / 2 + nx * bow,
        cy: (a.y + b.y) / 2 + ny * bow
      };
    }

    function edgeFade(x, y) {
      const fadeZone = Math.min(120, Math.max(68, Math.min(width, height) * 0.18));
      const minEdgeDistance = Math.min(x, y, width - x, height - y);
      const raw = Math.max(0, Math.min(1, minEdgeDistance / fadeZone));
      return raw * raw * (3 - 2 * raw);
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = 'rgba(33, 34, 36, 0.22)';
      ctx.setLineDash([1.2, 7]);
      const cx = width * 0.54;
      const cy = height * 0.49;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, width * (0.18 + i * 0.09), height * (0.16 + i * 0.075), Math.sin(time * 0.00008 + i) * 0.22, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      for (const n of nodes) {
        n.phase += n.speed;
        n.vx += Math.sin(n.phase * 0.8) * n.ax;
        n.vy += Math.cos(n.phase * 0.7) * n.ay;
        n.vx = Math.max(-0.52, Math.min(0.52, n.vx));
        n.vy = Math.max(-0.52, Math.min(0.52, n.vy));

        n.x += n.vx + Math.sin(n.phase) * 0.12;
        n.y += n.vy + Math.cos(n.phase * 1.12) * 0.12;

        const pad = 34;
        if (n.x < -pad) n.x = width + pad;
        if (n.x > width + pad) n.x = -pad;
        if (n.y < -pad) n.y = height + pad;
        if (n.y > height + pad) n.y = -pad;
      }

      const maxDistance = width < 520 ? 145 : 190;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance && Math.abs(i - j) % 3 !== 1) {
            const fade = Math.min(edgeFade(a.x, a.y), edgeFade(b.x, b.y));
            const alpha = (1 - distance / maxDistance) * 0.34 * fade;
            if (alpha < 0.01) continue;
            const c = curveBetween(a, b, 28 + Math.sin(time * 0.0007 + i) * 18);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = (i + j) % 5 === 0 ? 'rgba(199, 159, 105, 0.60)' : (i + j) % 4 === 0 ? 'rgba(36, 95, 107, 0.54)' : 'rgba(112, 111, 105, 0.45)';
            ctx.lineWidth = (i + j) % 6 === 0 ? 1.15 : 0.72;
            if ((i + j) % 4 === 0) ctx.setLineDash([2, 5]);
            else ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(c.cx, c.cy, b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      for (const n of nodes) {
        const fade = edgeFade(n.x, n.y);
        if (fade < 0.02) continue;
        const pulse = 1 + Math.sin(time * 0.002 + n.phase) * 0.08;
        const r = n.radius * pulse;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        if (n.hollow) {
          ctx.fillStyle = 'rgba(251, 250, 246, 0.24)';
          ctx.fill();
          ctx.lineWidth = n.large ? 1.8 : 1.25;
          ctx.strokeStyle = n.color.stroke;
          ctx.stroke();
        } else {
          ctx.fillStyle = n.color.fill;
          ctx.globalAlpha = (n.large ? 0.78 : 0.86) * fade;
          ctx.fill();
        }

        if (n.large) {
          ctx.globalAlpha = 0.12 * fade;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 1.85, 0, Math.PI * 2);
          ctx.strokeStyle = n.color.stroke;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return function destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }

  canvases.forEach(setup);
})();