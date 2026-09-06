document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id], .site-header#home')];
  const progress = document.querySelector('#scroll-progress');
  const form = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedMotionQuery.matches;

  const updateNavbar = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 24);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  const closeMenu = () => {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('is-open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  document.addEventListener('click', (event) => {
    if (navLinks?.classList.contains('is-open') && !navLinks.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (navAnchors.includes(link)) closeMenu();
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); } }), { threshold: 0.14 });
    revealItems.forEach((item) => observer.observe(item));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => anchor.removeAttribute('aria-current'));
      const active = navAnchors.find((anchor) => anchor.getAttribute('href') === `#${entry.target.id}`);
      active?.setAttribute('aria-current', 'page');
    }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('has-errors');
      formStatus.textContent = 'Please complete the highlighted fields before transmitting.';
      form.querySelector(':invalid')?.focus();
      return;
    }
    const name = new FormData(form).get('name');
    form.classList.remove('has-errors');
    formStatus.textContent = `Transmission received, ${name || 'explorer'}! Mission control will be in touch. (Demo only — no message was sent.)`;
    form.reset();
    formStatus.focus();
  });
  form?.addEventListener('input', () => form.classList.remove('has-errors'));
  reducedMotionQuery.addEventListener?.('change', (event) => { reducedMotion = event.matches; if (reducedMotion) revealItems.forEach((item) => item.classList.add('is-visible')); });
});
