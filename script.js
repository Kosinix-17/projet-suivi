// Fonctions Modal contact
function openModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.remove('hidden');
}
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.add('hidden');
}

// ===== BILLET SPATIAL =====
function closeBillet() {
    const modal = document.getElementById('billet-modal');
    if (modal) modal.classList.add('hidden');
}

function showBillet(name, email) {
    document.getElementById('billet-name').textContent = name;
    document.getElementById('billet-email').textContent = email;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('billet-date').textContent = dateStr;

    const num = 'EFR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('billet-number').textContent = num;

    const modal = document.getElementById('billet-modal');
    if (modal) modal.classList.remove('hidden');
}

// ===== INTRO STAR WARS =====
function skipIntro() {
    const intro = document.getElementById('sw-intro');
    if (!intro) return;
    intro.style.opacity = '0';
    setTimeout(() => { intro.style.display = 'none'; }, 1000);
}

function initStarWars() {
    const intro = document.getElementById('sw-intro');
    if (!intro) return;

    // Dessiner les étoiles sur le canvas
    const canvas = document.getElementById('sw-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < 250; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = Math.random() * 1.4 + 0.2;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`;
            ctx.fill();
        }
    }

    // Phase 1 : "Il y a bien longtemps..." (0 → 3s)
    const faraway = document.getElementById('sw-faraway');
    setTimeout(() => { if (faraway) faraway.style.opacity = '1'; }, 300);
    setTimeout(() => { if (faraway) faraway.style.opacity = '0'; }, 3000);

    // Phase 2 : Vaisseau (4s → 9s)
    setTimeout(() => {
        const ship = document.getElementById('sw-ship');
        if (ship) ship.classList.add('sw-fly');
    }, 4000);

    // Phase 3 : Crawl (6s)
    setTimeout(() => {
        const scene = document.getElementById('sw-scene');
        const crawl = document.querySelector('.sw-crawl');
        if (scene) scene.style.opacity = '1';
        if (crawl) crawl.classList.add('sw-rolling');
    }, 6000);

    // Phase 4 : Fin auto (44s)
    setTimeout(skipIntro, 44000);
}

// Fonctions du Carousel
let slideIndex = 1;
let isAnimating = false;
let autoPlay;

function changeSlide(n) {
    goToSlide(slideIndex + n, n > 0 ? 'forward' : 'backward');
}
function currentSlide(n) {
    goToSlide(n, n > slideIndex ? 'forward' : 'backward');
}

function goToSlide(n, direction) {
    if (isAnimating) return;
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    if (n > slides.length) n = 1;
    if (n < 1) n = slides.length;
    if (n === slideIndex) return;

    isAnimating = true;
    const prevSlide = slides[slideIndex - 1];
    slideIndex = n;
    const nextSlide = slides[slideIndex - 1];

    // Place incoming slide off-screen instantly (no transition)
    nextSlide.style.transition = 'none';
    nextSlide.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
    nextSlide.classList.add('active');

    // Force reflow so the position is applied before transition starts
    nextSlide.getBoundingClientRect();

    // Animate both slides
    nextSlide.style.transition = 'transform 0.5s ease';
    nextSlide.style.transform = 'translateX(0)';
    prevSlide.style.transition = 'transform 0.5s ease';
    prevSlide.style.transform = direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';

    setTimeout(() => {
        prevSlide.classList.remove('active');
        prevSlide.style.transform = '';
        prevSlide.style.transition = '';
        nextSlide.style.transform = '';
        nextSlide.style.transition = '';
        isAnimating = false;
    }, 500);

    dots.forEach(d => d.classList.remove('active'));
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
}

function startAutoPlay() {
    autoPlay = setInterval(() => goToSlide(slideIndex + 1, 'forward'), 4000);
}
function stopAutoPlay() {
    clearInterval(autoPlay);
}

document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('registration-toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hide');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 3000);
    }

    // --- INTRO STAR WARS (page inscription uniquement) ---
    if (document.getElementById('sw-intro')) {
        initStarWars();
    }

    // --- GESTION DE L'INSCRIPTION ---
    const inscriptionForm = document.getElementById('inscription-form');
    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;

            const data = new FormData(inscriptionForm);

            try {
                const response = await fetch(inscriptionForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    inscriptionForm.reset();
                    showBillet(`${firstName} ${lastName}`, email);
                } else {
                    showToast('Une erreur est survenue. Veuillez réessayer.');
                }
            } catch {
                showToast('Impossible d\'envoyer. Vérifiez votre connexion.');
            }
        });
    }

    // --- GESTION DU FORMULAIRE CONTACT ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.reset();
                    openModal();
                } else {
                    showToast("Une erreur est survenue. Veuillez réessayer.");
                }
            } catch {
                showToast("Impossible d'envoyer le message. Vérifiez votre connexion.");
            }
        });
    }

    // Auto-play carousel
    if (document.querySelector('.carousel-item')) {
        startAutoPlay();
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
});