# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + React Three Fiber (@react-three/fiber, @react-three/drei). Static build deployed to Vercel. No backend.

## Users

Employers and recruiters screening Rastafari Khaliel Sarzona, in two equal tracks:

1. AI data / LLM evaluation hiring (remote data annotation, LLM evaluation, NLP roles).
2. Software / web development hiring (internships, junior developer roles).

They arrive from a CV link, LinkedIn, or an application, usually with little time. Their job: decide quickly whether this candidate is worth an interview, and find proof (projects, accuracy numbers, real client work) to back that decision.

## Product Purpose

A personal portfolio that is also an interactive 3D desk scene. It presents Rastafari's work, skills, experience, and contact details. Success: a recruiter understands who Rastafari is and what they have built within one viewport, explores at least one project, and reaches contact or the CV download.

## Positioning

The candidate is a bilingual Filipino–English CS student who did the full data work behind a real ML thesis (BANTAY): hand-verified and labeled 188 handwritten Taglish records against a 35-category taxonomy, benchmarked Gemma 4 against four SEA-LION checkpoints, and built the OCR and human-review pipeline. Rastafari also shipped paid remote web work for a US client. Few student portfolios can show both careful human data work and shipped engineering.

## Operating Context

- Recruiters open it on desktop and on phones, often between other applications.
- Exploration: a scroll-guided camera tour of the desk, plus clicking any desk object to jump straight to its section.
- A plain, fast "simple view" of the same content must exist for no-WebGL devices, low-end phones, reduced motion, and recruiters who want to skim.

## Capabilities and Constraints

- Site sections are Projects, Experience, Skills and Contact only. It showcases projects; it is not a copy of the CV (no education, certifications or summary-of-qualifications content).
- Each project shows only: a plain one-paragraph summary, stack, the candidate's role, how it works in plain non-technical steps, app screenshots, and team credit. No benchmark tables or metrics on the project sheet.
- Project screenshots live in public/projects/<id>/, copied unedited from the project's own deck or app.

- All content comes from one data file built from the CV and, later, the project repositories.
- Public contact: email (rastafarisarzona2@gmail.com), LinkedIn (linkedin.com/in/rastafari-sarzona), GitHub (github.com/sarzonarastafarikhaliel). The phone number is never shown on the site; it stays only in the downloadable CV PDF.
- Location shown: Angeles City, Pampanga, Philippines. Open to remote work.
- Undecided: custom domain; project list beyond BANTAY (repos not yet provided); more screenshots if wanted.

## Brand Commitments

- User-pinned feel: cozy, minimalist, desk-only scene. No room, island, or space themes.
- High Three.js quality is a stated requirement.

## Evidence on Hand

- BANTAY thesis defense deck (BANTAY Presentation.pdf, October 2026): authoritative source for BANTAY figures. Classification is zero-shot (the CV's "few-shot" wording and "83.8% held-out" figure are not in the deck and are not used).
- CV: Rastafari_Sarzona_Resume.pdf (provided in conversation; to be placed at `public/cv.pdf` for download).
- Real figures from the CV: 188 records labeled, 35-category taxonomy, 84% category-group accuracy (Gemma 4), 83.8% on held-out data, five OCR engines compared, 4-person thesis team, 14-page news site, 120 WPM.
- Work: Freelance Web Developer, 24/7 Laredo (remote, Laredo, Texas), 07/2026–08/2026. Intern, Electronics & Documentation, A2K Group, 06/2024–07/2024.
- Education: BS Computer Science, Angeles University Foundation, 2023–present. SHS STEM, Chevalier School, 2022 (With Honors, Best in Research, Best in Capstone Project).
- Certifications: Microsoft Azure AI Fundamentals (TESDA, 2025), Introduction to CSS (TESDA, 2025), CCNA: Introduction to Networks (Cisco Networking Academy).
- Absent, must not be fabricated: testimonials, client quotes, employer logos, project screenshots, live demo URLs, a profile photo.

## Product Principles

1. Proof before personality: real numbers and shipped work are visible early.
2. Never block the recruiter: the 3D scene is optional, and the simple view is one click away.
3. One source of truth: every fact on the page comes from the CV or a repo.
4. Calm over spectacle: the scene invites exploring and never performs at the visitor.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` (no camera tour animation; jump cuts or simple view).
- Every 3D hotspot has a keyboard-reachable, labeled HTML equivalent.
- Text content is real HTML, crawlable and readable by screen readers.
