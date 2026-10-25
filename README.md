# Rastafari Khaliel Sarzona · Portfolio

An interactive portfolio set on a 3D desk. Each object on the desk is a project or a section: open the laptop for BANTAY, the newspaper for 24/7 Laredo, the coffee bag for BrewView, the index-card box for skills, and the envelope for contact details. Scroll to take the tour, or click any object to jump to it.

**Live site:** _add your Vercel URL here_

## Features

- A night desk scene built with Three.js through React Three Fiber, lit by a single lamp, with real-time soft shadows and procedural materials (felt, card, brushed aluminium).
- A poster-style hero: the name in large display type that the desk objects stand in front of, a black, white and red palette, and a custom cursor.
- A scroll-driven camera tour with numbered stops, plus click-to-jump on every desk object.
- A voxel "Thinker" figurine that assembles itself cube by cube when the page loads.
- A **Simple view** with the same content as a plain page. It switches on automatically when the browser has no WebGL support, and the camera skips its animations when the visitor has reduced motion turned on.
- Works on phones, with a bottom navigation strip and portrait camera framing.

## Projects featured

| Project | What it is |
|---|---|
| BANTAY | Thesis project that turns handwritten barangay blotter records into classified, searchable records. |
| 24/7 Laredo | Freelance build of a 14-page local news website on GoHighLevel. |
| BrewView | Coffee review website that sorts customer reviews into positive, neutral or negative. |

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Three.js](https://threejs.org/) with [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- Plain CSS, with [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) self-hosted through Fontsource
- Deployed on [Vercel](https://vercel.com/) as a static site

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev       # development server with hot reload, usually http://localhost:5173
npm run build     # type-check and build into dist/
npm run preview   # serve the production build, usually http://localhost:4173
```

Add `?simple` to the URL to open the Simple view directly.

## Project structure

```
src/
  content.ts   All site text: profile, projects, skills and tour stops
  App.tsx      Page layout, sections and the Simple view
  Scene.tsx    The 3D desk: objects, materials, lighting and camera tour
  styles.css   Styles for the page and the reading sheets
  main.tsx     Entry point
public/
  projects/    Screenshots for each project
```

## Editing content

All text lives in `src/content.ts`.

- **Change your intro or contact details:** edit `profile`.
- **Add a project:** add an entry to `projects`, put its screenshots in `public/projects/<id>/`, and add a matching stop to `stops`. To give it its own desk object, add a component in `src/Scene.tsx`, a camera pose in `POSES`, and a `Hotspot` with the same id in `Desk`.
- **Update skills:** edit `skills`. Items in `core` appear as highlighted chips, and items in `more` appear as plain text.
- **Enable the CV download:** put your PDF at `public/cv.pdf` and set `cv: '/cv.pdf'` in `profile`.

## Deploy

Vercel detects the Vite setup on its own, so no configuration file is needed.

- **From the command line:** run `npx vercel` for a preview deploy, then `npx vercel --prod` for the live site.
- **From GitHub:** push this repository, then import it on vercel.com. Every later push to `main` redeploys the site.

## Contact

- Email: [rastafarisarzona2@gmail.com](mailto:rastafarisarzona2@gmail.com)
- LinkedIn: [linkedin.com/in/rastafari-sarzona](https://linkedin.com/in/rastafari-sarzona)
- GitHub: [github.com/sarzonarastafarikhaliel](https://github.com/sarzonarastafarikhaliel)
