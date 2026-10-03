const mobileViewport = window.matchMedia('(max-width: 760px)');
const compactNavigation = window.matchMedia('(max-width: 960px)');
const mobileReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pageRoot = document.documentElement;
const mobileMenu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
let menuDestination = null;

// Native dialogs supply focus containment, Escape support, and a modal backdrop.
menuToggle.addEventListener('click', () => {
  menuDestination = null;
  mobileMenu.showModal();
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.querySelector('.mobile-menu-close').focus();
});
mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => mobileMenu.close());
mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const destination = document.querySelector(link.getAttribute('href'));
    if (!destination) return;
    event.preventDefault();
    menuDestination = destination;
    mobileMenu.close();
    history.pushState(null, '', link.getAttribute('href'));
  });
});
mobileMenu.addEventListener('close', () => {
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (!menuDestination) {
    if (compactNavigation.matches) menuToggle.focus({ preventScroll: true });
    return;
  }
  const destination = menuDestination;
  menuDestination = null;
  const previousTabIndex = destination.getAttribute('tabindex');
  destination.setAttribute('tabindex', '-1');
  destination.focus({ preventScroll: true });
  destination.scrollIntoView({ behavior: mobileReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  destination.addEventListener('blur', () => {
    if (previousTabIndex === null) destination.removeAttribute('tabindex');
    else destination.setAttribute('tabindex', previousTabIndex);
  }, { once: true });
});
compactNavigation.addEventListener('change', () => {
  if (!compactNavigation.matches && mobileMenu.open) mobileMenu.close();
});
pageRoot.classList.add('has-mobile-menu');

const toolkitContent = document.querySelector('.toolkit-content');
const touchHint = document.createElement('p');
touchHint.className = 'mobile-tool-hint';
touchHint.textContent = 'TAP AN ICON. MEET MY TOOLS.';
toolkitContent.querySelector('h2').after(touchHint);
const workHint = document.querySelector('#work-hint');
function updateTouchCopy() {
  workHint.firstChild.textContent = mobileViewport.matches ? 'SCROLL OR SWIPE TO EXPLORE ' : 'SCROLL TO EXPLORE ';
}
mobileViewport.addEventListener('change', updateTouchCopy);
updateTouchCopy();

// Small, scroll-linked gestures replace the desktop's hover-only flourishes.
// No perpetual animation loop: update once per scroll frame, and never in a modal.
const motionSections = ['.hero', '.about-section', '.toolkit-section', '.experience-section', '.contact-section'].map(selector => document.querySelector(selector));
const toolkitIcons = [...document.querySelectorAll('.tool-icon-button')];
const revealElements = [...document.querySelectorAll('.about-copy, .tool-list > div, .education-heading, .learning-entry')];
let motionFrame = 0;
let revealObserver;
const bounded = (value, min, max) => Math.max(min, Math.min(max, value));

function paintMobileMotion() {
  motionFrame = 0;
  if (!mobileViewport.matches || mobileReducedMotion.matches || document.hidden || document.querySelector('dialog[open]')) return;
  const viewportHeight = window.innerHeight;
  const pageHeight = pageRoot.scrollHeight - viewportHeight;
  // Read all bounds before writing styles to avoid layout thrashing.
  const bounds = motionSections.map(section => section.getBoundingClientRect());
  const progress = rect => bounded((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
  pageRoot.style.setProperty('--reading-progress', pageHeight > 0 ? bounded(window.scrollY / pageHeight, 0, 1) : 0);
  if (bounds[0].bottom > 0) {
    const heroProgress = bounded(-bounds[0].top / bounds[0].height, 0, 1);
    motionSections[0].style.setProperty('--hero-shift', `${-heroProgress * 9}px`);
    motionSections[0].style.setProperty('--hero-turn', `${-12 + heroProgress * 100}deg`);
  }
  if (bounds[1].top < viewportHeight && bounds[1].bottom > 0) {
    const amount = progress(bounds[1]);
    motionSections[1].style.setProperty('--art-turn', `${-2.5 + amount * 5}deg`);
    motionSections[1].style.setProperty('--flower-turn', `${-25 + amount * 120}deg`);
  }
  if (bounds[2].top < viewportHeight && bounds[2].bottom > 0) {
    const amount = progress(bounds[2]);
    toolkitIcons.forEach((icon, index) => {
      icon.style.setProperty('--tool-lift', `${Math.sin(amount * Math.PI * 2 + index * .65) * 7}px`);
    });
  }
  if (bounds[3].top < viewportHeight && bounds[3].bottom > 0) {
    motionSections[3].style.setProperty('--experience-turn', `${-15 + progress(bounds[3]) * 85}deg`);
  }
  if (bounds[4].top < viewportHeight && bounds[4].bottom > 0) {
    motionSections[4].style.setProperty('--contact-turn', `${-20 + progress(bounds[4]) * 100}deg`);
  }
}
function queueMobileMotion() {
  if (!motionFrame && mobileViewport.matches && !mobileReducedMotion.matches && !document.hidden) {
    motionFrame = requestAnimationFrame(paintMobileMotion);
  }
}
function configureMobileMotion() {
  cancelAnimationFrame(motionFrame);
  motionFrame = 0;
  revealObserver?.disconnect();
  const enabled = mobileViewport.matches && !mobileReducedMotion.matches;
  pageRoot.classList.toggle('mobile-motion', enabled);
  if (!enabled) {
    revealElements.forEach(element => element.classList.add('is-visible'));
    return;
  }
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .08 });
    revealElements.forEach(element => {
      element.classList.add('mobile-reveal');
      if (!element.classList.contains('is-visible')) revealObserver.observe(element);
    });
  }
  queueMobileMotion();
}
window.addEventListener('scroll', queueMobileMotion, { passive: true });
window.addEventListener('resize', queueMobileMotion, { passive: true });
document.addEventListener('visibilitychange', queueMobileMotion);
document.querySelectorAll('dialog').forEach(modal => modal.addEventListener('close', queueMobileMotion));
mobileViewport.addEventListener('change', configureMobileMotion);
mobileReducedMotion.addEventListener('change', configureMobileMotion);
document.fonts.ready.then(queueMobileMotion);
configureMobileMotion();
