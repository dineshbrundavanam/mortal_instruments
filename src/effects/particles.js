/* ═══════════════════════════════════════════════════════════════════════════
   particles.js — Floating rune particles background effect
   ═══════════════════════════════════════════════════════════════════════════ */

const RUNE_GLYPHS = [
  // Simplified rune path segments (drawn on canvas)
  'angelic', 'voyance', 'iratze', 'parabatai', 'strength', 'fearless'
];

let animationId = null;

export function initParticles() {
  const canvas = document.getElementById('rune-particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 6,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -Math.random() * 0.3 - 0.05,
      opacity: Math.random() * 0.3 + 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      type: Math.floor(Math.random() * 6),
      life: 0,
      maxLife: Math.random() * 1000 + 500,
    };
  }
  
  function drawRuneGlyph(ctx, x, y, size, type, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    
    const s = size / 2;
    
    switch (type) {
      case 0: // Angelic power - vertical line with cross
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.moveTo(-s * 0.6, -s * 0.3);
        ctx.lineTo(s * 0.6, -s * 0.3);
        ctx.stroke();
        break;
      case 1: // Voyance - eye shape
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.quadraticCurveTo(0, -s * 0.8, s, 0);
        ctx.quadraticCurveTo(0, s * 0.8, -s, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 2: // Triangle rune
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(-s * 0.7, s * 0.6);
        ctx.lineTo(s * 0.7, s * 0.6);
        ctx.closePath();
        ctx.stroke();
        break;
      case 3: // Diamond
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.moveTo(0, -s * 0.4);
        ctx.lineTo(0, s * 0.4);
        ctx.stroke();
        break;
      case 4: // Curved lines
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, -s);
        ctx.quadraticCurveTo(s * 0.5, -s * 0.2, -s * 0.2, s * 0.5);
        ctx.moveTo(s * 0.4, -s * 0.6);
        ctx.quadraticCurveTo(-s * 0.5, s * 0.2, s * 0.3, s);
        ctx.stroke();
        break;
      case 5: // Circle with line
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Add new particles
    if (particles.length < 25) {
      particles.push(createParticle());
    }
    
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.life++;
      
      // Fade in and out
      let alpha = p.opacity;
      if (p.life < 50) alpha *= p.life / 50;
      if (p.life > p.maxLife - 50) alpha *= (p.maxLife - p.life) / 50;
      
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      drawRuneGlyph(ctx, p.x, p.y, p.size, p.type, p.rotation);
      
      // Remove dead particles
      if (p.life > p.maxLife || p.y < -50 || p.x < -50 || p.x > width + 50) {
        particles[i] = createParticle();
        particles[i].y = height + 20;
      }
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  resize();
  window.addEventListener('resize', resize);
  animate();
  
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  };
}
