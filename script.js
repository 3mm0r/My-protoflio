document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Roles Typing Effect
  const roles = ["web interfaces", "databases", "network security", "AI fundamentals"];
  const typedTextSpan = document.getElementById('typedText');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 300;
    }

    setTimeout(type, typeSpeed);
  }
  type();

  // 2. Scroll Reveal Animation
  const observerOptions = { threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.rv').forEach((el, index) => {
    el.style.transitionDelay = `${(index % 3) * 80}ms`;
    observer.observe(el);
  });

  // 3. Theme Switcher
  const themeToggleBtn = document.getElementById('themeToggle');
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    themeToggleBtn.innerHTML = newTheme === 'dark' 
      ? '<i class="fa-solid fa-moon"></i>' 
      : '<i class="fa-solid fa-sun"></i>';
  });

  // 4. Interactive Particle Background Canvas
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let width, height, points = [];
  const mouse = { x: -999, y: -999 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const numPoints = Math.min(70, Math.floor((width * height) / 16000));
    
    points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#5eead4';

    points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Distance to mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distMouse = Math.hypot(dx, dy);

      if (distMouse < 150) {
        p.x += dx * 0.012;
        p.y += dy * 0.012;
      }

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.globalAlpha = (1 - dist / 130) * 0.35;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (distMouse < 170) {
        ctx.globalAlpha = (1 - distMouse / 170) * 0.6;
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -999;
  });

  resize();
  draw();
});
