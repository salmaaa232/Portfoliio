# Salma Hammouda — Portfolio

A lightweight portfolio built with semantic HTML, CSS, and JavaScript. No dependencies or API keys required. Node.js 20+ is sufficient for the local scripts.

## Run

```sh
npm run dev
```

Open http://localhost:5173. To create deployable files, run `npm run build`. Publish the contents of `dist/` on a static host. `npm run preview` serves that build locally.

Vercel is configured through `vercel.json` to run the build and deploy the generated `dist/` directory.

## Content

- Project covers are original HTML/CSS interface illustrations, not application screenshots.
- Zakrily's custom case study includes the supplied video, prototype link, pitch deck, and team roles. Its template is in `index.html`; deck assets are in `assets/zakrily/`.
- Other project descriptions are in `app.js`; page text and contact links are in `index.html`.
- Typography loads DM Sans and IBM Plex Mono from Google Fonts, with local system fallbacks. All artwork and skill icons are local.

## Interactions and accessibility

Rotating hero typography, a reversible scroll-linked project ribbon, native accessible dialogs, a skill-icon mouse trail, email clipboard action, keyboard focus indicators, and reduced-motion support.

`mobile.css` and `mobile.js` provide the compact navigation dialog (up to 960px), phone layouts (up to 760px), scroll-linked artwork, and tappable toolkit icons. Mobile motion runs only on scroll frames while the page is visible and no dialog is open. Horizontal touch gestures temporarily pause the project ribbon's page-driven motion. The desktop mouse trail remains limited to pointer devices; text content never depends on hover.
