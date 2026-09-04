(function () {
  const hasGsap = typeof window.gsap !== 'undefined';
  const nav = document.getElementById('nav');

  /* ---- Mobile menu (no gsap dependency, always works) ---- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ---- Nav light/dark theme by section + shrink/blur on scroll ----
     Plain scroll-position check against each section's bounds — checked
     against whichever section sits behind the nav bar itself, not the
     viewport center, so it stays correct at any scroll speed. */
  const themedSections = Array.from(document.querySelectorAll('[data-navtheme]'));
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const probeY = 40; // point just below the nav bar
    let current = null;
    for (const s of themedSections) {
      const r = s.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) { current = s; break; }
    }
    if (current) {
      nav.classList.toggle('theme-light', current.getAttribute('data-navtheme') === 'light');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  if (!hasGsap) {
    // GSAP failed to load (offline/CDN blocked) — page still fully readable
    // via default (visible) CSS, just without the motion flourishes.
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---- Custom cursor (desktop only) ---- */
  const cursor = document.getElementById('cursorDot');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', e => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  /* ---- Hero entrance ---- */
  gsap.set('.hero-sub', { opacity: 0, y: 16 });
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('.hero-eyebrow', { opacity: 0.75, y: 0, duration: 0.7, delay: 0.2 })
    .from('.hero-title .line', { yPercent: 110, duration: 0.9, stagger: 0.12 }, '-=0.3')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.5');

  /* subtle rotation on hero crosshairs */
  gsap.to('.hero-crosshair.c1', { rotation: 360, duration: 60, repeat: -1, ease: 'linear' });
  gsap.to('.hero-crosshair.c2', { rotation: -360, duration: 80, repeat: -1, ease: 'linear' });

  /* ---- Marquee auto-scroll ---- */
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const width = track.scrollWidth / 2;
    gsap.to(track, { x: -width, duration: 22, ease: 'none', repeat: -1 });
  }

  /* ---- Generic reveal-up on scroll (hidden state set here, so it only
     ever hides content once GSAP has actually taken over) ---- */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.set(el, { opacity: 0, y: 36 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    });
  });

  /* ---- Stats count-up ---- */
  gsap.utils.toArray('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  /* ---- Work card magnetic tilt ---- */
  document.querySelectorAll('.work-card').forEach(card => {
    const media = card.querySelector('.work-card-media');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(media, { rotateX: y * -6, rotateY: x * 6, duration: 0.4, ease: 'power2.out', transformPerspective: 600 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(media, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
})();
