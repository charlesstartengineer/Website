document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const form = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedMotionQuery.matches;

  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  const scrollPlanets = [...document.querySelectorAll('.scroll-planet')];
  let motionFrame = null;
  const updatePlanetMotion = () => {
    motionFrame = null;
    if (reducedMotion) return;
    const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / scrollRange, 1);
    scrollPlanets.forEach((planet, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const distance = 90 + index * 28;
      planet.style.setProperty('--scroll-shift', `${(progress * distance * direction).toFixed(2)}px`);
      planet.style.setProperty('--scroll-rotate', `${(progress * (index % 2 ? -18 : 24)).toFixed(2)}deg`);
    });
  };
  const requestPlanetMotion = () => { if (!motionFrame) motionFrame = requestAnimationFrame(updatePlanetMotion); };
  window.addEventListener('scroll', requestPlanetMotion, { passive: true });
  window.addEventListener('resize', requestPlanetMotion, { passive: true });
  const handleMotionPreference = (event) => { reducedMotion = event.matches; if (reducedMotion) scrollPlanets.forEach((planet) => planet.style.removeProperty('--scroll-shift')); else requestPlanetMotion(); };
  if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener('change', handleMotionPreference); else reducedMotionQuery.addListener(handleMotionPreference);
  requestPlanetMotion();

  const closeMenu = () => { navLinks.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation menu'); };
  menuToggle.addEventListener('click', () => { const isOpen = navLinks.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(isOpen)); menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu'); });
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => { const target = document.querySelector(link.getAttribute('href')); if (!target) return; event.preventDefault(); target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }); closeMenu(); }));

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion) revealItems.forEach((item) => item.classList.add('is-visible'));
  else if ('IntersectionObserver' in window) { const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); } }), { threshold: 0.14 }); revealItems.forEach((item) => observer.observe(item)); }
  else revealItems.forEach((item) => item.classList.add('is-visible'));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    const name = String(data.get('name') || 'explorer').trim();
    const senderEmail = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = `Space Explorer transmission from ${name}`;
    const body = `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`;
    const mailto = `mailto:charliemacallen@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    formStatus.textContent = `Your email app should open addressed to charliemacallen@gmail.com. Delivery depends on your email app and provider.`;
    form.reset();
  });
});
