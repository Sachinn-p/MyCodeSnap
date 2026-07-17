# Design

## Theme

Dark. The workspace is always dark — developers work in dark terminals and editors; the canvas matches that mental model. Background: `neutral-950` (`hsl(224 71.4% 4.1%)`). Surface: `neutral-900`. Border: `neutral-800`.

## Palette

- **Background**: `hsl(224 71.4% 4.1%)` — near-black with a cold blue lean
- **Surface**: `hsl(224 71.4% 7%)` — panels and sidebars
- **Border**: `hsl(217.2 32.6% 17.5%)` — subtle separation
- **Foreground**: `hsl(210 20% 98%)` — primary text
- **Muted**: `hsl(215 20.2% 65.1%)` — secondary labels, hints
- **Accent / Primary action**: `indigo-600` (`#4f46e5`) — the one warm note; used for the Export button and interactive focus
- **Destructive**: red at low opacity for hover states on delete actions

## Typography

- **UI font**: Geist (variable, loaded via `@fontsource-variable/geist`). Used throughout the chrome.
- **Code font**: system monospace stack for code node content.
- **Scale**: `text-xs` (10–12px) dominates the sidebar and toolbar — dense, tool-flavored. `text-sm` for panel headers. Prose is not a surface in this product.

## Components

- **Toolbar**: `h-14`, sticky top, `bg-neutral-950/50 backdrop-blur-md`, bordered bottom. Buttons are `text-xs` pill-rounded ghost style with hover fill.
- **Sidebar**: `w-80`, right-side, `bg-neutral-900/30`, scrollable. Section headers are `text-xs uppercase tracking-wider text-neutral-400`.
- **Floating panels** (code/diff editor): Framer Motion draggable, `rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl`.
- **Export button**: `bg-indigo-600 hover:bg-indigo-700`, rounded-md, shadow with `indigo-500/20` tint. The one filled-color element in the toolbar.
- **Export dropdown**: `bg-neutral-900 border-neutral-700`, appears with scale+fade motion, grouped by format category.
- **Canvas background**: configurable gradient (Tailwind gradient presets), defaults to `neutral-950` solid.
- **Node chrome**: rounded, shadow, draggable — node content owns its own background (e.g. code node uses a code editor bg).

## Layout

- App shell: full-viewport flex column. Header (fixed) → main (flex-1, overflow-hidden).
- Main: horizontal split — canvas section (`flex-1`) + right sidebar (`w-80 shrink-0`).
- Canvas: overflow-hidden, pan/zoom via CSS transform on an inner frame.
- No left sidebar. Navigation is top-only.

## Motion

- Framer Motion throughout. Dropdowns: `opacity + y + scale` over `120ms`. Floating panels are freely draggable.
- Reduced motion: transitions should fall back to instant or crossfade.

## Spacing

Dense tool density. Padding `px-4 py-3` for panel sections, `px-3 py-1.5` for toolbar buttons. `space-y-6` between sidebar sections, `space-y-4` within.

## Radius

`rounded-md` for buttons, `rounded-xl` for floating panels, `rounded-lg` for dropdowns. Base radius token: `0.5rem`.
