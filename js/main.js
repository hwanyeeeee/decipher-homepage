// DECIPHER Website - Main JS

// =========================================
// 1. Scroll Reveal
// =========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// =========================================
// 2. Mobile Menu Toggle
// =========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}


// =========================================
// 3. Floating Particles
// =========================================
(function spawnParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left             = Math.random() * 100 + '%';
        p.style.width            = (Math.random() * 3 + 1) + 'px';
        p.style.height           = p.style.width;
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay   = (Math.random() * -20) + 's';
        p.style.opacity          = Math.random() * 0.5 + 0.1;
        container.appendChild(p);
    }
})();


// =========================================
// 4. Binary Rain (actually renders the CSS class)
// =========================================
(function spawnBinaryRain() {
    const container = document.getElementById('binaryRain');
    if (!container) return;

    const columnCount = Math.max(8, Math.floor(window.innerWidth / 50));

    for (let i = 0; i < columnCount; i++) {
        const el = document.createElement('div');
        el.className = 'binary-rain';

        // Build a short vertical string of 0/1 characters
        const len = Math.floor(Math.random() * 10) + 5;
        el.textContent = Array.from({ length: len }, () => Math.round(Math.random())).join('\n');

        el.style.left             = (i / columnCount * 100 + Math.random() * 3) + '%';
        el.style.animationDuration = (Math.random() * 8 + 6) + 's';
        el.style.animationDelay   = (Math.random() * -16) + 's';
        el.style.writingMode      = 'vertical-rl';
        el.style.letterSpacing    = '6px';

        container.appendChild(el);
    }
})();


// =========================================
// 5. Navbar: border opacity on scroll + active link
// =========================================
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.style.borderBottomColor = window.scrollY > 50
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(255,255,255,0.03)';

    // Active section highlight
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                const active = link.getAttribute('href') === '#' + id;
                link.classList.toggle('text-cyber',    active);
                link.classList.toggle('text-gray-300', !active);
            });
        }
    });
}, { passive: true });


// =========================================
// 6. Smooth scroll (offset for fixed nav)
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH, behavior: 'smooth' });
    });
});


console.log('DECIPHER website loaded.');
