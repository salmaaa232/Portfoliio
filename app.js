const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
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
      asterisk.style.transform = `rotate(${wordIndex * 60 - 12}deg)`;
    }, 420);
  }, 3200);
}
startWords();
reducedMotion.addEventListener('change', startWords);
document.addEventListener('visibilitychange', startWords);

const projects = {
  kalemly: {
    index: '01', title: 'KalemlyAI', category: 'AI SAAS / CUSTOMER SUPPORT / JULY 2026',
    lead: 'Your business knowledge. A helpful answer, in two languages.',
    sections: [
      ['The idea', 'Give businesses a no-code way to create Arabic and English support chatbots from the information they already have: PDFs, documents, text files, and websites.'],
      ['What I built', 'A RAG-powered chatbot builder with hybrid retrieval, multi-turn conversation memory, and an embeddable website widget. I implemented an automatic multi-model LLM fallback chain and human escalation workflows.'],
      ['Why it matters', 'The product brings knowledge ingestion, retrieval, and a customer-facing conversation into one workflow. Built as part of the Tips Hindawi Challenge.'],
    ], tags: ['Next.js', 'LangChain', 'Groq', 'ChromaDB', 'RAG', 'Arabic / English'],
  },
  zakrily: {
    index: '02', title: 'Zakrily', category: 'AI EDUCATION / PRODUCT PROTOTYPE',
    lead: 'A more personal way to learn. Built around understanding.',
    sections: [
      ['The vision', 'An AI education prototype for Egypt’s national school curriculum, exploring how learning can adapt to each student.'],
      ['The proposed experience', 'Adaptive quizzes focus practice on areas that need attention. Subject-specific experiences include English and French speaking practice, photo-based math help, and interactive science simulations. Streaks, XP, and leaderboards are part of the product vision.'],
      ['Meet Nawara', 'The proposed conversational tutor helps students ask questions about lessons, while skill-tagged questions guide what they practice next.'],
      ['Prototype status', 'Zakrily is a prototype. These features describe the intended product experience; this case study does not claim that every feature is implemented or that the product is deployed.'],
    ], tags: ['Product prototype', 'Adaptive learning', 'Conversational AI', 'EdTech'],
  },
  autobrief: {
    index: '03', title: 'Autobrief', category: 'MULTIMODAL AI / GDG EUI HACKATHON / DECEMBER 2025',
    lead: 'From scattered client inputs to a structured starting point.',
    sections: [
      ['The idea', 'Client ideas arrive in many forms. Autobrief brings text, audio, and images into one brief-generation workflow.'],
      ['What I built', 'A full-stack AI client-brief platform with multi-input processing, AI filtering, transcription, OCR, and brief generation.'],
      ['The creative connection', 'The interesting engineering challenge was turning different forms of expression into a consistent, useful output. Built during the GDG EUI Hackathon.'],
    ], tags: ['Next.js', 'Supabase', 'FastAPI', 'Groq', 'OCR', 'Audio transcription'],
  },
  care: {
    index: '04', title: 'Teleconsultation', category: 'FULL-STACK PLATFORM / NOVEMBER–DECEMBER 2025',
    lead: 'Connecting appointments, people, and remote consultations.',
    sections: [
      ['The product', 'A doctor appointment and teleconsultation web application with role-based access for patients, doctors, and administrators.'],
      ['My contribution', 'Working in a team of two, I led backend development, implementing scheduling, video calls, payments, and secure authentication.'],
      ['The engineering', 'The application connects a React and Next.js interface with Clerk authentication, a NeonDB database through Prisma, and Vonage-powered video calls.'],
    ], tags: ['React', 'Next.js', 'Clerk', 'NeonDB', 'Prisma', 'Vonage'],
  },
};

const dialog = document.querySelector('.project-dialog');
let previousFocus;
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
  for (const [title, copy] of project.sections) {
    const section = document.createElement('section'); section.className = 'case-section';
    const heading = document.createElement('h3'); heading.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = copy;
    section.append(heading, paragraph); content.append(section);
  }
  const tags = document.createElement('div'); tags.className = 'case-tags';
  project.tags.forEach(tag => { const span = document.createElement('span'); span.textContent = tag; tags.append(span); });
  content.append(tags);
  document.body.classList.add('modal-open');
  cursor.classList.remove('visible');
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
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus({ preventScroll: true }); });

const cursor = document.querySelector('.project-cursor');
document.querySelectorAll('.project-cover').forEach(cover => {
  cover.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('visible');
  });
  cover.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
});
window.addEventListener('scroll', () => cursor.classList.remove('visible'), { passive: true });

const svg = (content, viewBox = '0 0 32 32') => `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
const toolIcons = [
  { name: 'n8n', icon: svg('<path d="M7 16h7l6-8h5M14 16l6 8h5" stroke="#ea527a" stroke-width="2.7"/><circle cx="5" cy="16" r="3" fill="#ea527a"/><circle cx="15" cy="16" r="3" fill="#ea527a"/><circle cx="26" cy="8" r="3" fill="#ea527a"/><circle cx="26" cy="24" r="3" fill="#ea527a"/>') },
  { name: 'VS Code', icon: svg('<path d="M23 2 10 14 4 9 1 11v10l3 2 6-5 13 12 8-4V6L23 2ZM5 17v-2l3 1-3 1Zm18 5-10-6 10-6v12Z" fill="#2499e5"/>') },
  { name: 'Hugging Face', icon: '<span class="emoji-icon">🤗</span>' },
  { name: 'React', icon: svg('<g stroke="#38aeca" stroke-width="1.4"><ellipse cx="16" cy="16" rx="15" ry="5.5"/><ellipse cx="16" cy="16" rx="15" ry="5.5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="15" ry="5.5" transform="rotate(120 16 16)"/></g><circle cx="16" cy="16" r="2.7" fill="#38aeca"/>') },
  { name: 'Python', icon: svg('<path d="M16 2c-7 0-7 2-7 8h9v2H6c-6 0-6 14 0 14h3v-6c0-4 3-5 7-5h6c4 0 4-3 4-6V7c0-4-3-5-10-5Z" fill="#3978a4"/><path d="M16 30c7 0 7-2 7-8h-9v-2h12c6 0 6-14 0-14h-3v6c0 4-3 5-7 5h-6c-4 0-4 3-4 6v2c0 4 3 5 10 5Z" fill="#eec84a"/><circle cx="13" cy="6" r="1.3" fill="white"/><circle cx="19" cy="26" r="1.3" fill="white"/>') },
  { name: 'Figma', icon: svg('<path d="M11 1a5 5 0 0 0 0 10h5V1h-5Z" fill="#f24e1e"/><path d="M16 1h5a5 5 0 0 1 0 10h-5Z" fill="#ff7262"/><path d="M11 11a5 5 0 0 0 0 10h5V11Z" fill="#a259ff"/><circle cx="21" cy="16" r="5" fill="#1abcfe"/><path d="M11 21a5 5 0 1 0 5 5v-5Z" fill="#0acf83"/>') },
  { name: 'AI', icon: svg('<path d="m16 2 3.7 10.3L30 16l-10.3 3.7L16 30l-3.7-10.3L2 16l10.3-3.7Z" fill="#61763f"/><path d="m26 1 1.3 3.7L31 6l-3.7 1.3L26 11l-1.3-3.7L21 6l3.7-1.3Z" fill="#9dba69"/>') },
  { name: 'Next.js', icon: svg('<circle cx="16" cy="16" r="15" fill="#222"/><path d="M10 23V9l16 19M22 9v10" stroke="white" stroke-width="2"/>') },
  { name: 'After Effects', icon: '<span class="letter-icon" style="color:#6f55c8">Ae</span>' },
];
const staticIcons = document.querySelector('.static-tool-icons');
toolIcons.slice(0, 7).forEach(tool => { const item = document.createElement('span'); item.innerHTML = tool.icon; item.title = tool.name; staticIcons.append(item); });
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
reducedMotion.addEventListener('change', () => { trailLayer.replaceChildren(); cursor.classList.remove('visible'); });

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
