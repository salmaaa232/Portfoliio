# Salma Hammouda — Portfolio

A lightweight portfolio built with semantic HTML, CSS, and JavaScript. No dependencies or API keys required. Node.js 20+ is sufficient for the local scripts.

## Run

```sh
npm run dev
```

Open http://localhost:5173. To create deployable files, run `npm run build`. Publish the contents of `dist/` on a static host. `npm run preview` serves that build locally.

Vercel is configured through `vercel.json` to run the build and deploy the generated `dist/` directory.

## Content

- Project previews are original HTML/CSS interface illustrations, not real application screenshots. Each case study explicitly explains this.
- Zakrily is labeled as a prototype, with its supplied feature description presented as the product vision.
- Project descriptions are in `app.js`; page text and contact links are in `index.html`.
- No fabricated project URLs, performance metrics, customer counts, or personal contribution for Zakrily are included.
- Replace illustrations with actual product screenshots when available, and add verified demo or repository links to the case studies.
- Typography loads DM Sans and IBM Plex Mono from Google Fonts, with local system fallbacks. All artwork and skill icons are local.

## Interactions and accessibility

Rotating hero typography, project hover previews, native accessible project dialogs, skill-icon mouse trail, email clipboard action, keyboard focus indicators, responsive layouts, and reduced-motion support. The icon trail is limited to the toolkit and disabled on touch devices. Text content does not depend on hover interactions.
