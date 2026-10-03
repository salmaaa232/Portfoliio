const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const siteHeader = document.querySelector('.site-header');
let headerFrame = 0;
let headerCompact = false;
function updateStickyHeader() {
  headerFrame = 0;
  // Separate thresholds prevent flicker near the transition point.
  headerCompact = headerCompact ? window.scrollY > 12 : window.scrollY > 48;
  siteHeader.classList.toggle('is-compact', headerCompact);
}
window.addEventListener('scroll', () => {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateStickyHeader);
}, { passive: true });
window.addEventListener('pageshow', updateStickyHeader);
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--header-height', `${siteHeader.getBoundingClientRect().height}px`);
}).observe(siteHeader);
updateStickyHeader();
const changingWord = document.querySelector('#changing-word');
const asterisk = document.querySelector('.hero-asterisk');
const words = ['AI', 'SAAS', 'LLM'];
let wordIndex = 0;
let wordTimer;
let wordTransition;
function startWords() {
  clearInterval(wordTimer);
  clearTimeout(wordTransition);
  changingWord.classList.remove('leaving', 'entering');
  if (reducedMotion.matches || document.hidden) return;
  wordTimer = setInterval(() => {
    changingWord.classList.add('leaving');
    wordTransition = setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      changingWord.textContent = words[wordIndex];
      changingWord.classList.remove('leaving');
      changingWord.classList.add('entering');
      requestAnimationFrame(() => requestAnimationFrame(() => changingWord.classList.remove('entering')));
      if (window.innerWidth > 760) asterisk.style.transform = `rotate(${wordIndex * 60 - 12}deg)`;
    }, 420);
  }, 3200);
}
startWords();
reducedMotion.addEventListener('change', startWords);
document.addEventListener('visibilitychange', startWords);

const projects = {
  kalemly: {
    index: '02', title: 'KalemlyAI', category: 'AI SAAS · RAG · TIPS HINDAWI CHALLENGE · JULY 2026',
    lead: 'Your business knowledge. A helpful answer, in two languages.',
  },
  zakrily: {
    index: '01', title: 'Zakrily', category: 'EDTECH STARTUP / AI-POWERED LEARNING',
    lead: 'A more personal way to learn. Built around understanding.',
  },
  autobrief: {
    index: '03', title: 'Autobrief', category: 'MULTIMODAL AI · AI BRIEF GENERATION · GDG EUI HACKATHON · DEC 2025',
    lead: 'From scattered client inputs to a structured starting point.',
  },
  care: {
    index: '04', title: 'DocLink', category: 'TELEMEDICINE / BACKEND DEVELOPMENT',
    lead: 'From finding a doctor to joining a consultation.',
  },
};

const dialog = document.querySelector('.project-dialog');
let previousFocus;
function renderZakrilyCaseStudy(content) {
  content.append(document.querySelector('#zakrily-case-study').content.cloneNode(true));
  const reader = content.querySelector('.deck-reader');
  const image = reader.querySelector('.deck-image');
  const counter = reader.querySelector('.deck-count');
  const previous = reader.querySelector('.deck-prev');
  const next = reader.querySelector('.deck-next');
  const error = reader.querySelector('.deck-error');
  const titles = ['Every child learns differently', 'The problem', 'The solution', 'Meet Nawwara', 'Prototype demo', 'Market opportunity', 'Business model', 'Competitive analysis', 'Go-to-market strategy', 'Start narrow, prove it works', 'Parent-led acquisition', 'From pilot to platform', 'SWOT analysis', 'Pricing and positioning', 'Revenue model and financial outlook', 'Our team', 'Thank you'];
  let currentSlide = 0;
  let requestedSlide = 0;
  let requestId = 0;
  const updateButtons = () => {
    previous.disabled = requestedSlide === 0;
    next.disabled = requestedSlide === titles.length - 1;
  };
  async function showSlide(index) {
    requestedSlide = Math.max(0, Math.min(titles.length - 1, index));
    const slide = requestedSlide;
    const request = ++requestId;
    updateButtons();
    reader.setAttribute('aria-busy', 'true');
    error.hidden = true;
    const preview = new Image();
    preview.src = `/assets/zakrily/slides/${String(slide + 1).padStart(2, '0')}.webp`;
    try {
      // Keep the previous slide visible until the new one is ready to paint.
      await preview.decode();
      if (request !== requestId || !reader.isConnected) return;
      image.src = preview.src;
      image.alt = `Slide ${slide + 1} of ${titles.length}: ${titles[slide]}`;
      counter.textContent = `${String(slide + 1).padStart(2, '0')} / ${titles.length}`;
      currentSlide = slide;
    } catch {
      if (request !== requestId || !reader.isConnected) return;
      requestedSlide = currentSlide;
      updateButtons();
      error.hidden = false;
    } finally {
      if (request === requestId) reader.removeAttribute('aria-busy');
    }
  }
  image.addEventListener('error', () => { error.hidden = false; });
  previous.addEventListener('click', () => showSlide(requestedSlide - 1));
  next.addEventListener('click', () => showSlide(requestedSlide + 1));
  reader.addEventListener('keydown', event => {
    const destinations = { ArrowLeft: requestedSlide - 1, ArrowRight: requestedSlide + 1, Home: 0, End: titles.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    showSlide(destinations[event.key]);
  });
  let deckGesture = null;
  image.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    deckGesture = { x: event.clientX, y: event.clientY };
    image.setPointerCapture(event.pointerId);
  });
  image.addEventListener('pointerup', event => {
    if (!deckGesture) return;
    const dx = event.clientX - deckGesture.x;
    const dy = event.clientY - deckGesture.y;
    deckGesture = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      showSlide(requestedSlide + (dx < 0 ? 1 : -1));
    }
  });
  image.addEventListener('pointercancel', () => { deckGesture = null; });
}
function openProject(id) {
  const project = projects[id];
  if (!project) return;
  previousFocus = document.activeElement;
  document.querySelector('#dialog-index').textContent = project.index;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-lead').textContent = project.lead;
  const content = document.querySelector('#dialog-content');
  content.replaceChildren();
  dialog.classList.toggle('project-dialog--zakrily', id === 'zakrily');
  dialog.classList.toggle('project-dialog--kalemly', id === 'kalemly');
  dialog.classList.toggle('project-dialog--autobrief', id === 'autobrief');
  dialog.classList.toggle('project-dialog--doclink', id === 'care');
  if (id === 'zakrily') {
    renderZakrilyCaseStudy(content);
  } else if (id === 'kalemly') {
    content.append(document.querySelector('#kalemly-case-study').content.cloneNode(true));
  } else if (id === 'autobrief') {
    content.append(document.querySelector('#autobrief-case-study').content.cloneNode(true));
  } else if (id === 'care') {
    content.append(document.querySelector('#doclink-case-study').content.cloneNode(true));
  } else {
    for (const [title, copy] of project.sections) {
      const section = document.createElement('section'); section.className = 'case-section';
      const heading = document.createElement('h3'); heading.textContent = title;
      const paragraph = document.createElement('p'); paragraph.textContent = copy;
      section.append(heading, paragraph); content.append(section);
    }
    const tags = document.createElement('div'); tags.className = 'case-tags';
    project.tags.forEach(tag => { const span = document.createElement('span'); span.textContent = tag; tags.append(span); });
    content.append(tags);
  }
  document.body.classList.add('modal-open');
  hideCursor();
  dialog.showModal();
  dialog.scrollTop = 0;
  document.querySelector('.dialog-close').focus();
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  // Removing the embedded player stops playback when the case study closes.
  document.querySelector('#dialog-content').replaceChildren();
  document.body.classList.remove('modal-open');
  previousFocus?.focus({ preventScroll: true });
});

const cursor = document.querySelector('.project-cursor');
let cursorX = -300, cursorY = -300, targetX = -300, targetY = -300, cursorFrame = 0;
function tickCursor() {
  cursorX += (targetX - cursorX) * 0.12;
  cursorY += (targetY - cursorY) * 0.12;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  cursorFrame = requestAnimationFrame(tickCursor);
}
function setCursorTarget(x, y) {
  if (!cursor.classList.contains('visible')) { cursorX = x; cursorY = y; }
  targetX = x; targetY = y;
  if (!cursorFrame) cursorFrame = requestAnimationFrame(tickCursor);
}
function hideCursor() {
  cursor.classList.remove('visible');
  if (cursorFrame) { cancelAnimationFrame(cursorFrame); cursorFrame = 0; }
}
document.querySelectorAll('.project-cover').forEach(cover => {
  cover.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    setCursorTarget(event.clientX, event.clientY);
    cursor.classList.add('visible');
  });
  cover.addEventListener('pointerleave', hideCursor);
});
window.addEventListener('scroll', () => hideCursor(), { passive: true });

const svg = (content, viewBox = '0 0 32 32') => `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
const toolIcons = [
  { name: 'n8n', icon: svg('<path d="M7 16h7l6-8h5M14 16l6 8h5" stroke="#ea527a" stroke-width="2.7"/><circle cx="5" cy="16" r="3" fill="#ea527a"/><circle cx="15" cy="16" r="3" fill="#ea527a"/><circle cx="26" cy="8" r="3" fill="#ea527a"/><circle cx="26" cy="24" r="3" fill="#ea527a"/>') },
  { name: 'VS Code', icon: svg('<path d="M23 2 10 14 4 9 1 11v10l3 2 6-5 13 12 8-4V6L23 2ZM5 17v-2l3 1-3 1Zm18 5-10-6 10-6v12Z" fill="#2499e5"/>') },
  { name: 'Hugging Face', icon: '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#hugging-face"></use></svg>' },
  { name: 'React', icon: svg('<g stroke="#38aeca" stroke-width="1.4"><ellipse cx="16" cy="16" rx="15" ry="5.5"/><ellipse cx="16" cy="16" rx="15" ry="5.5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="15" ry="5.5" transform="rotate(120 16 16)"/></g><circle cx="16" cy="16" r="2.7" fill="#38aeca"/>') },
  { name: 'Python', icon: svg('<path d="M16 2c-7 0-7 2-7 8h9v2H6c-6 0-6 14 0 14h3v-6c0-4 3-5 7-5h6c4 0 4-3 4-6V7c0-4-3-5-10-5Z" fill="#3978a4"/><path d="M16 30c7 0 7-2 7-8h-9v-2h12c6 0 6-14 0-14h-3v6c0 4-3 5-7 5h-6c-4 0-4 3-4 6v2c0 4 3 5 10 5Z" fill="#eec84a"/><circle cx="13" cy="6" r="1.3" fill="white"/><circle cx="19" cy="26" r="1.3" fill="white"/>') },
  { name: 'Figma', icon: svg('<path d="M11 1a5 5 0 0 0 0 10h5V1h-5Z" fill="#f24e1e"/><path d="M16 1h5a5 5 0 0 1 0 10h-5Z" fill="#ff7262"/><path d="M11 11a5 5 0 0 0 0 10h5V11Z" fill="#a259ff"/><circle cx="21" cy="16" r="5" fill="#1abcfe"/><path d="M11 21a5 5 0 1 0 5 5v-5Z" fill="#0acf83"/>') },
  { name: 'AI', icon: svg('<path d="m16 2 3.7 10.3L30 16l-10.3 3.7L16 30l-3.7-10.3L2 16l10.3-3.7Z" fill="#61763f"/><path d="m26 1 1.3 3.7L31 6l-3.7 1.3L26 11l-1.3-3.7L21 6l3.7-1.3Z" fill="#9dba69"/>') },
  { name: 'Next.js', icon: svg('<circle cx="16" cy="16" r="15" fill="#222"/><path d="M10 23V9l16 19M22 9v10" stroke="white" stroke-width="2"/>') },
  { name: 'After Effects', icon: '<span class="letter-icon" style="color:#6f55c8">Ae</span>' },
];
const staticIcons = document.querySelector('.static-tool-icons');
toolIcons.forEach(tool => {
  const item = document.createElement('button');
  item.className = 'tool-icon-button';
  item.type = 'button';
  item.innerHTML = `${tool.icon}<span class="tool-icon-name">${tool.name}</span>`;
  item.title = tool.name;
  item.setAttribute('aria-label', tool.name);
  item.setAttribute('aria-pressed', 'false');
  item.addEventListener('click', () => {
    const selected = !item.classList.contains('is-selected');
    staticIcons.querySelectorAll('button').forEach(button => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    });
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  staticIcons.append(item);
});
staticIcons.removeAttribute('aria-hidden');
staticIcons.setAttribute('role', 'group');
staticIcons.setAttribute('aria-label', 'Explore my tools');
const toolkit = document.querySelector('.toolkit-section');
const trailLayer = document.querySelector('.icon-trail-layer');
let lastPoint = null;
let lastTrailTime = 0;
let iconIndex = 0;
toolkit.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches) return;
  const now = performance.now();
  if (lastPoint && Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y) < 58) return;
  if (now - lastTrailTime < 60) return;
  const rect = toolkit.getBoundingClientRect();
  const icon = document.createElement('span');
  icon.className = 'trail-icon'; icon.innerHTML = toolIcons[iconIndex++ % toolIcons.length].icon;
  icon.style.left = `${event.clientX - rect.left}px`; icon.style.top = `${event.clientY - rect.top}px`;
  icon.style.setProperty('--rotation', `${(iconIndex % 5 - 2) * 9}deg`);
  if (trailLayer.childElementCount >= 8) trailLayer.firstElementChild.remove();
  trailLayer.append(icon); icon.addEventListener('animationend', () => icon.remove(), { once: true });
  lastPoint = { x: event.clientX, y: event.clientY }; lastTrailTime = now;
});
toolkit.addEventListener('pointerleave', () => { lastPoint = null; });
reducedMotion.addEventListener('change', () => { trailLayer.replaceChildren(); hideCursor(); });

document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('salma.hammoouda@gmail.com');
    document.querySelector('.copy-text').textContent = 'COPIED!';
    status.textContent = 'Email address copied to your clipboard.';
    setTimeout(() => { document.querySelector('.copy-text').textContent = 'COPY EMAIL'; status.textContent = ''; }, 3500);
  } catch { status.textContent = 'You can copy the email address above or select it to open your email app.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.body.classList.add('js-reveal');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
}

// Scroll-linked ribbon: downward page movement sends the artwork to the right.
const workSection = document.querySelector('.work-section');
const workPanel = document.querySelector('.work-sticky');
const projectTrack = document.querySelector('#project-track');
const previousProject = document.querySelector('.work-prev');
const nextProject = document.querySelector('.work-next');
const originalProjects = [...projectTrack.children];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
let cycleWidth = 0;
let trackTarget = 0;
let trackFrame = 0;
let lastFrameTime = 0;
let lastWrittenScroll = 0;
let previousProgress = 0;
let initialized = false;
let projectGesture = null;
let projectTouchPauseUntil = 0;
const maxTrackScroll = () => projectTrack.scrollWidth - projectTrack.clientWidth;
const projectStep = () => originalProjects[0].getBoundingClientRect().width + parseFloat(getComputedStyle(projectTrack).columnGap);
function pageProgress() {
  const rect = workSection.getBoundingClientRect();
  // Animate for the entire time the section travels through the viewport.
  return clamp(window.innerHeight - rect.top, 0, window.innerHeight + rect.height);
}
function updateProjectControls() {
  previousProject.disabled = reducedMotion.matches && projectTrack.scrollLeft <= 1;
  nextProject.disabled = reducedMotion.matches && projectTrack.scrollLeft >= maxTrackScroll() - 1;
}
function writeTrackPosition(position) {
  projectTrack.scrollLeft = position;
  lastWrittenScroll = projectTrack.scrollLeft;
}
function normalizeTrack() {
  if (reducedMotion.matches || !cycleWidth) return;
  const position = projectTrack.scrollLeft;
  const normalized = cycleWidth * 2 + ((position - cycleWidth * 2) % cycleWidth + cycleWidth) % cycleWidth;
  const shift = normalized - position;
  if (Math.abs(shift) > 1) {
    writeTrackPosition(normalized);
    trackTarget += shift;
  }
}
function animateProjectTrack(time) {
  const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 64) : 16;
  lastFrameTime = time;
  const difference = trackTarget - projectTrack.scrollLeft;
  // A longer, frame-rate-independent ease gives the ribbon a gentle glide.
  writeTrackPosition(projectTrack.scrollLeft + difference * (1 - Math.exp(-elapsed / 190)));
  normalizeTrack();
  if (Math.abs(trackTarget - projectTrack.scrollLeft) > .5) {
    trackFrame = requestAnimationFrame(animateProjectTrack);
  } else {
    writeTrackPosition(trackTarget);
    normalizeTrack();
    trackFrame = 0;
    lastFrameTime = 0;
  }
  updateProjectControls();
}
function moveProjectTrack(target) {
  if (reducedMotion.matches) {
    trackTarget = clamp(target, 0, maxTrackScroll());
    writeTrackPosition(trackTarget);
    updateProjectControls();
    return;
  }
  // Limit only the pending travel, so a large page jump cannot hit a track edge.
  trackTarget = projectTrack.scrollLeft + clamp(target - projectTrack.scrollLeft, -cycleWidth, cycleWidth);
  if (!trackFrame) trackFrame = requestAnimationFrame(animateProjectTrack);
}
function stopProjectAnimation() {
  cancelAnimationFrame(trackFrame);
  trackFrame = 0;
  lastFrameTime = 0;
  trackTarget = projectTrack.scrollLeft;
  lastWrittenScroll = projectTrack.scrollLeft;
}
function createProjectCopies() {
  const copySet = () => originalProjects.map(project => {
    const copy = project.cloneNode(true);
    copy.dataset.loopCopy = '';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('button, a, [tabindex]').forEach(element => element.tabIndex = -1);
    return copy;
  });
  projectTrack.prepend(...copySet(), ...copySet());
  projectTrack.append(...copySet(), ...copySet());
}
function measureProjectTrack() {
  stopProjectAnimation();
  const previousCycle = cycleWidth;
  const phase = initialized && previousCycle ? ((projectTrack.scrollLeft % previousCycle) + previousCycle) % previousCycle / previousCycle : 0;
  const hasCopies = !!projectTrack.querySelector('[data-loop-copy]');
  if (reducedMotion.matches && hasCopies) {
    projectTrack.querySelectorAll('[data-loop-copy]').forEach(copy => copy.remove());
  } else if (!reducedMotion.matches && !hasCopies) {
    createProjectCopies();
  }
  projectTrack.classList.toggle('is-looping', !reducedMotion.matches);
  cycleWidth = projectStep() * originalProjects.length;
  projectTrack.querySelectorAll('.project-cover').forEach(cover => cover.style.setProperty('--preview-scale', cover.clientWidth / 600));
  trackTarget = reducedMotion.matches ? clamp(phase * cycleWidth, 0, maxTrackScroll()) : cycleWidth * (2 + phase);
  writeTrackPosition(trackTarget);
  previousProgress = pageProgress();
  initialized = true;
  updateProjectControls();
}
window.addEventListener('scroll', () => {
  const progress = pageProgress();
  const delta = progress - previousProgress;
  previousProgress = progress;
  if (reducedMotion.matches || dialog.open || !delta || projectGesture?.horizontal || performance.now() < projectTouchPauseUntil) return;
  // Decreasing scrollLeft moves the visible cards RIGHT; reversing scroll reverses them.
  moveProjectTrack(trackTarget - delta * .65);
  hideCursor();
}, { passive: true });
projectTrack.addEventListener('scroll', () => {
  if (Math.abs(projectTrack.scrollLeft - lastWrittenScroll) > 1) {
    stopProjectAnimation();
    normalizeTrack();
  }
  updateProjectControls();
  hideCursor();
}, { passive: true });
projectTrack.addEventListener('pointerdown', event => {
  stopProjectAnimation();
  if (event.pointerType === 'touch') projectGesture = { x: event.clientX, y: event.clientY, horizontal: false };
}, { passive: true });
projectTrack.addEventListener('pointermove', event => {
  if (!projectGesture || event.pointerType !== 'touch') return;
  const dx = Math.abs(event.clientX - projectGesture.x);
  const dy = Math.abs(event.clientY - projectGesture.y);
  if (dx > 8 && dx > dy) projectGesture.horizontal = true;
}, { passive: true });
function finishProjectGesture() {
  if (projectGesture?.horizontal) projectTouchPauseUntil = performance.now() + 900;
  projectGesture = null;
}
window.addEventListener('pointerup', finishProjectGesture, { passive: true });
window.addEventListener('pointercancel', finishProjectGesture, { passive: true });
projectTrack.addEventListener('wheel', event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) stopProjectAnimation();
}, { passive: true });
// Copies remain clickable, while keyboard and screen-reader navigation use the originals.
projectTrack.addEventListener('click', event => {
  const button = event.target.closest('[data-loop-copy] [data-project]');
  if (button) openProject(button.dataset.project);
});
projectTrack.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches || !event.target.closest('.project-cover')) {
    cursor.classList.remove('visible');
    return;
  }
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  cursor.classList.add('visible');
});
projectTrack.addEventListener('pointerleave', hideCursor);
previousProject.addEventListener('click', () => moveProjectTrack(trackTarget - projectStep()));
nextProject.addEventListener('click', () => moveProjectTrack(trackTarget + projectStep()));
projectTrack.addEventListener('keydown', event => {
  if (event.target !== projectTrack) return;
  const start = reducedMotion.matches ? 0 : cycleWidth * 2;
  const destinations = { ArrowLeft: trackTarget - projectStep(), ArrowRight: trackTarget + projectStep(), Home: start, End: start + projectStep() * (originalProjects.length - 1) };
  if (!(event.key in destinations)) return;
  event.preventDefault();
  moveProjectTrack(destinations[event.key]);
});
new ResizeObserver(measureProjectTrack).observe(workPanel);
window.addEventListener('resize', measureProjectTrack);
reducedMotion.addEventListener('change', measureProjectTrack);
document.fonts.ready.then(measureProjectTrack);
measureProjectTrack();
