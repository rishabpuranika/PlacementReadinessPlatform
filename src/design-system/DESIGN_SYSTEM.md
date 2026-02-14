# KodNest Premium Build System

Design system for a serious B2C product. One mind, no visual drift.

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon, no animation noise

## Color (max 4 in use)

| Token        | Value     | Use                    |
|-------------|-----------|------------------------|
| `--color-bg` | `#F7F6F3` | Background (off-white) |
| `--color-text` | `#111111` | Primary text           |
| `--color-accent` | `#8B0000` | CTAs, focus, status    |
| `--color-success` | `#4A6741` | Success, Shipped       |
| `--color-warning` | `#8B6914` | Warning                |

Plus: `--color-border`, `--color-border-focus`, `--color-text-muted` (derived).

## Typography

- **Headings:** `--font-serif` (Libre Baskerville), large, confident, generous spacing
- **Body:** `--font-sans` (Source Sans 3), 16–18px, line-height 1.6–1.8, max-width 720px for text blocks
- No decorative fonts, no random sizes

## Spacing (strict scale)

Use only: **8px, 16px, 24px, 40px, 64px**  
Tokens: `--space-1` … `--space-5`. Never use arbitrary values (e.g. 13px, 27px).

## Global layout

Every page must follow:

1. **Top Bar** — Left: project name; Center: Step X / Y; Right: status badge (Not Started / In Progress / Shipped)
2. **Context Header** — Large serif headline, one-line subtext, clear purpose, no hype
3. **Primary Workspace (70%)** — Main product interaction; clean cards, predictable components
4. **Secondary Panel (30%)** — Step explanation, copyable prompt, actions: Copy, Build in Lovable, It Worked, Error, Add Screenshot
5. **Proof Footer** — Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed; each requires proof

## Components

- **Primary button:** solid deep red (`kn-btn kn-btn-primary`)
- **Secondary button:** outlined (`kn-btn kn-btn-secondary`)
- Same hover (180ms ease-in-out) and border radius (`--radius`) everywhere
- **Inputs:** clean borders, no heavy shadows, clear focus state (`kn-input`)
- **Cards:** subtle border, no drop shadows, balanced padding (`kn-card`)
- **Status badge:** `kn-badge`, `kn-badge--success`, `kn-badge--accent`, `kn-badge--warning`

## Interaction

- Transitions: **150–200ms**, **ease-in-out**; no bounce, no parallax (`--transition`)

## Error & empty states

- **Errors:** explain what went wrong and how to fix; never blame the user (`kn-message--error`)
- **Empty states:** provide next action; never feel dead (`kn-message--empty`)

## Files

- `tokens.css` — Colors, typography, spacing, radii, transitions
- `base.css` — Reset, body, headings, text blocks
- `layout.css` — Top bar, context header, main, workspace, panel, proof footer
- `components.css` — Buttons, inputs, cards, badges, prompt box, check items, messages
- `index.css` — Imports all of the above
