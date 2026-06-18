// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2200);
});

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
    const glow = document.getElementById('mouseGlow');
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scrollProgress').style.width = (window.scrollY / h * 100) + '%';

    const btn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 500) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        btn.style.pointerEvents = 'auto';
    } else {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(16px)';
        btn.style.pointerEvents = 'none';
    }
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '59,130,246' : '251,191,36';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPING EFFECT =====
const phrases = [
    'Kiper terbaik sepanjang masa.',
    '5x IFFHS Best Goalkeeper.',
    'World Cup Champion 2010.',
    'El Santo del Fútbol.',
    '167 caps untuk Spanyol.',
    'Penyelamatan melawan Robben.'
];
let pi = 0, ci = 0, deleting = false;

function typeEffect() {
    const el = document.getElementById('typingText');
    const phrase = phrases[pi];
    if (!deleting) {
        el.textContent = phrase.substring(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
            setTimeout(() => { deleting = true; typeEffect(); }, 2000);
            return;
        }
    } else {
        el.textContent = phrase.substring(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(typeEffect, deleting ? 30 : 60);
}
typeEffect();

// ===== 3D TILT =====
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stats counter
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                const t = parseInt(el.dataset.target);
                let c = 0;
                const inc = t / 60;
                const timer = setInterval(() => {
                    c += inc;
                    if (c >= t) {
                        el.textContent = t.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(c).toLocaleString();
                    }
                }, 20);
            });

            // Progress bars
            entry.target.querySelectorAll('.pfill').forEach(el => {
                setTimeout(() => { el.style.width = el.dataset.width; }, 200);
            });

            // Timeline
            if (entry.target.id === 'timeline') {
                document.getElementById('timelineLine').classList.add('drawn');
            }

            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, #timeline')
    .forEach(el => revealObs.observe(el));

// ===== QUOTES CAROUSEL =====
let cIdx = 0;
const track = document.getElementById('carouselTrack');
const total = track.children.length;
const dotsContainer = document.getElementById('carouselDots');

for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goToSlide(i);
    dotsContainer.appendChild(d);
}

function goToSlide(i) {
    cIdx = i;
    track.style.transform = `translateX(-${cIdx * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, idx) => d.classList.toggle('active', idx === cIdx));
}

function moveCarousel(dir) {
    goToSlide((cIdx + dir + total) % total);
}

setInterval(() => moveCarousel(1), 5000);

// ===== LIGHTBOX =====
function openLightbox(src) {
    document.getElementById('lbImg').src = src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ===== THEME TOGGLE =====
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== SAVE SIMULATOR GAME =====
const gc = document.getElementById('gameCanvas');
const gctx = gc.getContext('2d');
let saves = 0, goals = 0, balls = [];

function resizeGame() {
    const w = Math.min(500, gc.parentElement.clientWidth - 48);
    gc.width = w;
    gc.height = w * 0.7;
}
resizeGame();
window.addEventListener('resize', resizeGame);

gc.addEventListener('click', e => {
    const rect = gc.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (gc.width / rect.width);
    const cy = (e.clientY - rect.top) * (gc.height / rect.height);

    for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dx = cx - b.x, dy = cy - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < b.r + 15) {
            balls.splice(i, 1);
            saves++;
            document.getElementById('gameSaves').textContent = saves;
            break;
        }
    }
});

function spawnBall() {
    const r = Math.max(12, gc.width * 0.025);
    balls.push({
        x: Math.random() * (gc.width - r * 2) + r,
        y: -r,
        r: r,
        speed: 1 + Math.random() * 2,
        wobble: Math.random() * 2 - 1,
        particles: []
    });
}

function drawGame() {
    gctx.clearRect(0, 0, gc.width, gc.height);

    // Draw goal
    const gw = gc.width * 0.5, gh = gc.height * 0.15;
    const gx = (gc.width - gw) / 2, gy = gc.height - gh;
    gctx.strokeStyle = 'rgba(255,255,255,0.15)';
    gctx.lineWidth = 2;
    gctx.strokeRect(gx, gy, gw, gh);

    // Goal net
    gctx.strokeStyle = 'rgba(255,255,255,0.05)';
    gctx.lineWidth = 1;
    for (let i = 0; i < gw; i += 15) {
        gctx.beginPath(); gctx.moveTo(gx + i, gy); gctx.lineTo(gx + i, gy + gh); gctx.stroke();
    }
    for (let i = 0; i < gh; i += 15) {
        gctx.beginPath(); gctx.moveTo(gx, gy + i); gctx.lineTo(gx + gw, gy + i); gctx.stroke();
    }

    // Goalkeeper emoji
    gctx.fillStyle = 'rgba(59,130,246,0.15)';
    gctx.font = `bold ${gc.width * 0.06}px Inter`;
    gctx.textAlign = 'center';
    gctx.fillText('🧤', gc.width / 2, gy + gh / 2 + gc.width * 0.02);

    // Draw balls
    for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.y += b.speed;
        b.x += Math.sin(b.y * 0.02) * b.wobble * 0.5;

        // Particles
        if (b.particles) {
            b.particles.forEach((p, idx) => {
                p.x += p.vx; p.y += p.vy; p.life -= 0.03;
                if (p.life <= 0) { b.particles.splice(idx, 1); return; }
                gctx.beginPath();
                gctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                gctx.fillStyle = `rgba(34,197,94,${p.life})`;
                gctx.fill();
            });
        }

        // Ball gradient
        gctx.beginPath();
        gctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const grad = gctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, '#666666');
        gctx.fillStyle = grad;
        gctx.fill();
        gctx.strokeStyle = 'rgba(0,0,0,0.3)';
        gctx.lineWidth = 1;
        gctx.stroke();

        // Ball pattern
        gctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let a = 0; a < 5; a++) {
            const angle = (a * 72 - 90) * Math.PI / 180;
            gctx.beginPath();
            gctx.arc(b.x + Math.cos(angle) * b.r * 0.5, b.y + Math.sin(angle) * b.r * 0.5, b.r * 0.18, 0, Math.PI * 2);
            gctx.fill();
        }

        // Ball enters goal
        if (b.y > gy + b.r) {
            balls.splice(i, 1);
            goals++;
            document.getElementById('gameGoals').textContent = goals;
        }
    }

    if (Math.random() < 0.02) spawnBall();
    requestAnimationFrame(drawGame);
}
drawGame();

function resetGame() {
    saves = 0;
    goals = 0;
    balls = [];
    document.getElementById('gameSaves').textContent = '0';
    document.getElementById('gameGoals').textContent = '0';
}
