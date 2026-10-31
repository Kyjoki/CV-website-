# Maksim Tsoy — Interactive CV

Personal CV website built with React, TypeScript, Vite and Tailwind CSS.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory on a static host. The project uses root-relative asset URLs and expects to be served at the root of its domain. No environment variables or backend are required.

## Included

- Full-screen red hero with a portrait that smoothly follows horizontal pointer movement.
- All 105 local WebP animation frames and the About portrait.
- Responsive navigation and mobile menu.
- Experience, hackathon highlights, education, skills, certifications and contact details.
- Updated CV PDF in `public/maksim-tsoy-cv.pdf`.
- Native CV download with a preloaded PDF and the filename `Maksim_Tsoy_CV.pdf`.

The projects section is intentionally hidden. English proficiency is B2. Qostanai AI Industry Hackathon is listed as a category win; HackAlem AI is listed separately as participation with 82 points.

## Files

- `src/App.tsx` — page content, contacts and PDF download.
- `src/components/Portrait.tsx` — pointer tracking, smoothing and frame blending.
- `src/components/Navbar.tsx` — desktop and mobile navigation.
- `src/hooks/useTypewriter.ts` — text animation with reduced-motion support.
- `src/index.css` — responsive styles.
- `public/media/turn-kling/` — complete animation sequence.

The two Helvetica stylesheet links are in `index.html`. They require internet access; system font fallbacks are included. All portrait assets and the CV are served locally. Embedded preview hosts may restrict downloads; use the deployed site in a standalone browser tab to check browser download behavior.

## Update the CV

Replace `public/maksim-tsoy-cv.pdf`, then update the version query in `CV_URL` and the About CV link in `src/App.tsx` to avoid serving a cached older file.
