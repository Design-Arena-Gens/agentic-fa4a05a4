(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Intersection reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
  if (io) reveals.forEach(el => io.observe(el)); else reveals.forEach(el => el.classList.add('visible'));

  // Testimonials carousel
  const viewport = document.querySelector('.carousel-viewport');
  const slides = Array.from(document.querySelectorAll('.carousel .slide'));
  const prevBtn = document.querySelector('.carousel .prev');
  const nextBtn = document.querySelector('.carousel .next');
  const dotsHost = document.querySelector('.carousel .dots');
  let index = 0; let timer; const slideCount = slides.length;

  if (viewport && slides.length && prevBtn && nextBtn && dotsHost) {
    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', '');
      b.addEventListener('click', () => go(i, true));
      dotsHost.appendChild(b);
    });

    function update(){
      viewport.style.transform = `translateX(-${index * 100}%)`;
      dotsHost.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-selected', String(i === index)));
    }

    function go(i, user=false){
      index = (i + slideCount) % slideCount;
      update();
      if (user) restart();
    }

    prevBtn.addEventListener('click', () => go(index - 1, true));
    nextBtn.addEventListener('click', () => go(index + 1, true));
    function restart(){ clearInterval(timer); timer = setInterval(()=> go(index + 1, false), 5000); }
    restart(); update();

    // Pause on hover/focus for accessibility
    const carousel = document.querySelector('.carousel');
    const stop = () => clearInterval(timer);
    const start = () => restart();
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
    });
  }
})();
