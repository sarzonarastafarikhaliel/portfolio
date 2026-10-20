---
name: Rastafari Khaliel Sarzona Portfolio
description: One felt desk pad seen from above; every stationery object holds one section.
colors:
  teal: "#1f8a8a"
  felt: "#9a9a94"
  desk: "#4a4f55"
  alu: "#d9dcdf"
  kraft: "#c8a77a"
  ink: "#1d2024"
  ink-kraft: "#4a3d2c"
  tape: "#17191c"
  tape-ink: "#eeeeea"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  sheet: "2px"
  tape: "3px"
spacing:
  tape-gap: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  gutter: "clamp(1rem, 4.5vw, 4.5rem)"
  sheet-pad: "clamp(1.5rem, 3vw, 2.75rem)"
components:
  tape-stop:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.tape-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tape}"
    padding: "0.5rem 0.65rem"
  tape-stop-current:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.tape-ink}"
    rounded: "{rounded.tape}"
    padding: "0.85rem 1.2rem"
  button-quiet:
    textColor: "{colors.ink}"
    padding: "0.85rem 0"
  tag:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.tape-ink}"
    rounded: "{rounded.tape}"
    padding: "0.4rem 0.55rem"
  sheet:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
---

# Design System: Rastafari Khaliel Sarzona Portfolio

## Overview

**Creative North Star: "The Felt & Anodized Desk"**

The whole site is one heather-grey wool felt desk pad seen from above in soft north-window daylight. Each section is a physical stationery object on that pad: a laptop for BANTAY, a folded newspaper for 24/7 Laredo, a clipboard for experience, an index-card box for skills, a kraft envelope for contact, plus a mug that holds no section and exists only for warmth. The 3D desk (React Three Fiber) stays put; navigation moves the camera from object to object and lays a kraft reading sheet onto the felt beside it.

Density is calm and low: one reading sheet per stop, one accent, a single typeface. Materials carry the identity, not ornament: felt fibre, anodized aluminium, kraft paper grain, glossy black embossing tape. The world explicitly refuses the lo-fi night desk (dark room, lamp glow, neon monitor) and the floating desk in a void; the desk is lit by day and fills the frame edge to edge.

Reading text is always screen-aligned HTML, so it stays legible and accessible; lettering inside the 3D scene is miniature set dressing that mirrors it. A plain Simple view carries the same content as a document and is always one click away, and automatic without WebGL.

**Key Characteristics:**
- Felt fills the frame; objects sit in three-quarter top-down view.
- Kraft sheets are the only reading surface.
- Black embossing tape is the one control vocabulary: nav stops, view toggle, buttons, stack tags.
- One teal anodized accent, used in trace amounts.
- State is shown by form (raised, inverted, lifted), never by an extra hue.
- Soft real shadows from one window light; no hard edges of light.

## Colors

A cool, desaturated studio palette of wool, metal, and paper, with a single anodized teal.

### Primary
- **Anodized Teal** (teal): the one accent. Text selection, input caret, the underline colour on hover for quiet links and contact links, and the anodized pen on the desk. Never a fill for controls, never a state colour.

### Neutral
- **Heather Felt** (felt): the ground of every view, the page background, the browser theme colour, and the phone nav strip. In the scene the felt texture sits darker and is lifted to this value by the window light.
- **Charcoal Desk Edge** (desk): the desk slab under the felt and the scrollbar thumb.
- **Anodized Aluminium** (alu): laptop, clipboard, and pen bodies; the current-stop tape (inverted tape).
- **Kraft** (kraft): every reading sheet and the contact envelope and card box in the scene. Carries a fine fractal-noise grain.
- **Desk Ink** (ink): all text on felt and kraft, the focus ring, text on the current-stop tape.
- **Kraft Ink** (ink-kraft): secondary text on kraft (meta lines, list markers).
- **Embossing Tape** (tape): label-tape fills for every control and tag.
- **Embossed Letter** (tape-ink): lettering on tape.

### Named Rules
**The One Teal Rule.** Teal is the only hue that is not a material neutral, and it appears only as a trace (selection, caret, a hover underline, one pen). If teal fills an area, it is wrong.

**The State-By-Form Rule.** Active, hover, and current are shown by lifting, raising, or inverting the tape (dark tape to aluminium tape), never by introducing a new colour.

## Typography

**Display Font:** Bricolage Grotesque, self-hosted at 400/500/600/700 (with system-ui, sans-serif fallback)
**Body Font:** Bricolage Grotesque
**Label Font:** Bricolage Grotesque 600, uppercase tracked, on tape only

**Character:** One grotesque throughout, with tight negative tracking at display sizes and wide positive tracking on tape labels, so the voice moves between a confident name on felt and stamped embossing tape. The same face, loaded as a font file, renders the text inside the 3D scene.

### Hierarchy
- **Display** (700, clamp(2.75rem, 5.6vw, 5.5rem), 0.94): the name, top-left on the felt. On phones clamp(2.5rem, 11vw, 4rem).
- **Headline** (700, clamp(2rem, 3.4vw, 3rem), 1): the heading of each kraft sheet.
- **Title** (600, 1.125rem, 1.3): entry headings inside a sheet; the role line under the name uses the same size at 600, and the project subtitle at 500.
- **Body** (400, 1rem, 1.55): sheet text and the hero summary, which caps at 44ch.
- **Body small** (400, 0.875rem): meta lines in kraft ink, and the scroll hint.
- **Label** (600, 0.75rem, 0.08em, uppercase): tape lettering. Stack tags step down to 0.6875rem; the primary button steps up to 0.875rem. Stop numbers use tabular figures at 60% opacity.

### Named Rules
**The Tape Case Rule.** Uppercase tracked lettering belongs to label tape, because that is how an embosser prints; the quiet button keeps the same lettering so the two actions read as a pair. Headings and running text stay in sentence case.

## Layout

A full-viewport fixed WebGL scene sits behind scrolling HTML. Each stop is a section at least one viewport tall (100svh), a two-column grid: the hero puts its copy in the left column (max 36rem) where the felt is empty; every other stop places its kraft sheet in the right column (max 36rem) while the camera frames the object to its left. Horizontal padding is the gutter (clamp(1rem, 4.5vw, 4.5rem)); sections pad 6.5rem on top for the bar and 12vh below.

Scroll position drives the camera continuously: it holds on a stop while its sheet is read and travels only in the last 28% of a section. Each stop has a fixed camera pose with a projection offset that pushes the subject beside the sheet (a fraction of width on landscape, of height on portrait).

The top bar holds the name mark (left), the numbered stop rail 01 to 06, and the view and CV actions. At max-width 760px, or portrait up to 1024px, the grid collapses to one column, sections start at 56svh so the object shows above the sheet, the rail becomes a horizontally scrolling strip of tapes fixed to the bottom edge on felt, and the proof figures appear as text under the summary.

Simple view drops the scene and rail: sections become a single 46rem centred document column.

Spacing rhythm: tape gaps 0.375rem; small stacks 0.75rem; block gaps 1.25rem; entry and action separations 2rem.

## Elevation & Depth

Depth is physical and soft, from one cool daylight window at the upper left. In the scene: a shadow-casting directional light (#f7f5f0) with a soft 5px shadow radius, a grey hemisphere fill, rectangular light-formers for reflections on metal, contact shadows under objects, filmic tone mapping, and a fog matching the background so the felt never ends in a hard edge. In HTML a radial vignette darkens the frame edges, and every raised object carries a low, diffuse shadow plus, on tape, a one-pixel inner top highlight like gloss on vinyl.

### Shadow Vocabulary
- **Tape at rest** (`inset 0 1px 0 rgb(255 255 255 / 0.07), 0 1px 2px rgb(0 0 0 / 0.3)`): nav stops, toggles, tags.
- **Tape lifted** (`inset 0 1px 0 rgb(255 255 255 / 0.07), 0 4px 10px rgb(0 0 0 / 0.3)`): tape hover, with a 1px rise.
- **Tape current** (`inset 0 1px 0 rgb(255 255 255 / 0.6), 0 5px 12px rgb(0 0 0 / 0.28)`): aluminium current-stop tape, raised 2px.
- **Button** (`inset 0 1px 0 rgb(255 255 255 / 0.07), 0 2px 4px rgb(0 0 0 / 0.25)`), hover `0 8px 16px rgb(0 0 0 / 0.28)` with a 2px rise.
- **Sheet on felt** (`0 1px 1px rgb(30 24 16 / 0.2), 0 14px 30px -10px rgb(20 22 25 / 0.5)`): a kraft sheet lying flat.

### Named Rules
**The Window Light Rule.** All shadows are soft, low, and cast down-right from one window. Shadows grow only when an object is lifted.

## Shapes

Near-square, cut-material corners: kraft sheets at 2px, tape at 3px, 3D objects with millimetre-scale rounded edges. No pills, no large radii, no outlined boxes; edges come from material contrast and shadow, not strokes. Embossed tapes lie on the felt at slight alternating angles, and a sheet settles in from a small rotation; nothing in HTML is permanently tilted.

## Components

### Label Tape (signature)
Glossy black embossing tape; the one control vocabulary.
- **Shape:** gently squared (3px).
- **Default:** embossing tape fill with embossed lettering, label type, 0.5rem 0.65rem padding.
- **Hover:** rises 1px and the shadow widens (0.25s, expo-out).
- **Current:** inverts to aluminium tape with ink lettering, raised 2px (aria-current).
- **Tag variant:** non-interactive, 0.6875rem, 0.4rem 0.55rem padding, listing a project stack.
- **In the scene:** the proof figures are large embossed tapes on the felt; the envelope carries a CONTACT tape.

### Buttons
- **Primary:** a larger tape (0.875rem label, 0.85rem 1.2rem padding). Hover rises 2px with a deeper shadow (0.3s, expo-out).
- **Quiet:** ink text with a 1px underline, no fill, no shadow, no inline padding; hover turns the underline teal.
- **Focus (all):** 2px ink outline, 3px offset.

### Kraft Sheet (signature)
- **Corner Style:** 2px.
- **Background:** kraft with a fractal-noise paper grain.
- **Shadow Strategy:** Sheet on felt (see Elevation).
- **Border:** none.
- **Internal Padding:** clamp(1.5rem, 3vw, 2.75rem).
- **Motion:** where scroll-driven animation is supported and motion is allowed, the sheet lays down as it enters: from 4rem lower, rotated -2.2deg, scale 1.015, with a taller shadow, settling flat.

### Navigation
Top bar: name mark (700, ink, no underline) left; numbered tape stops (01 to 06) and actions right. Bar is transparent over the felt. Phones: the stop rail moves to a bottom strip on felt with a soft upward shadow, scrolling sideways.

### Desk Object (scene)
Each section object is clickable. Hover lifts it 14mm; the active stop rests 6mm raised. Pointer cursor on hover. No glow, no outline, no colour change.

## Do's and Don'ts

### Do:
- **Do** put every reading surface on kraft, as screen-aligned HTML.
- **Do** build every control and tag from label tape, and show current state by inverting to aluminium tape.
- **Do** keep teal to selection, caret, hover underlines, and the pen.
- **Do** use Bricolage Grotesque for everything, including scene lettering.
- **Do** keep shadows soft and downward from one window, growing only on lift.
- **Do** keep Simple view one click away and honour reduced motion (no smooth scroll, no transitions, no lay-down).

### Don't:
- **Don't** introduce a second accent hue or colour-code state.
- **Don't** light the desk as a night scene with lamp glow or neon screens, or float it in a void.
- **Don't** make the 3D scene the only place content can be read; scene lettering is miniature set dressing that mirrors the HTML.
- **Don't** use pills, large radii, or stroked card outlines.
- **Don't** use uppercase tracked lettering outside tape and buttons.
