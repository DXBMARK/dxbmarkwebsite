---
name: DXBMARK
colors:
  surface: '#011523'
  surface-dim: '#011523'
  surface-bright: '#283b4a'
  surface-container-lowest: '#00101c'
  surface-container-low: '#081d2b'
  surface-container: '#0d2130'
  surface-container-high: '#192c3a'
  surface-container-highest: '#243746'
  on-surface: '#d1e5f8'
  on-surface-variant: '#dec1b0'
  inverse-surface: '#d1e5f8'
  inverse-on-surface: '#1f3241'
  outline: '#a68b7c'
  outline-variant: '#574236'
  surface-tint: '#ffb68a'
  primary: '#ffb68a'
  on-primary: '#512300'
  primary-container: '#f97e1a'
  on-primary-container: '#5c2800'
  inverse-primary: '#984800'
  secondary: '#ffb77a'
  on-secondary: '#4c2700'
  secondary-container: '#925000'
  on-secondary-container: '#ffd4b3'
  tertiary: '#8aceff'
  on-tertiary: '#00344e'
  tertiary-container: '#00aaf2'
  on-tertiary-container: '#003b57'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb68a'
  on-primary-fixed: '#321300'
  on-primary-fixed-variant: '#743500'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77a'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3a00'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#8aceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#011523'
  on-background: '#d1e5f8'
  surface-variant: '#243746'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 4.5rem
    fontWeight: '900'
    lineHeight: '1.05'
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: '1.65'
  body-md:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  menu-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '700'
    lineHeight: '1.5'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.5'
  code:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-gap: 24px
  margin-mobile: 40px
  margin-tablet: 60px
  margin-desktop: 80px
  section-v-space: 120px
  container-max: 1200px
---

# Design System - DXBMARK LLC

## 1. Visual Theme & Atmosphere

DXBMARK LLC is bold and direct — a professional technology services company offering engineered solutions. Vivid orange on deep slate-blue creates a confident, high-energy identity. The design reflects the brand personality: no-nonsense, technically serious, professional precision.

**Key Characteristics:**
- Orange on deep slate surfaces — bold and unmistakable
- High-contrast, minimal decoration
- Inter at large weights for confident headlines
- Dark-first — the product and marketing share one palette

## 2. Color Palette & Roles

Design tokens map directly to logical CSS variables in `src/app/globals.css`.

### Primary
- **Orange** (`--color-accent-primary` | `#F97E1A`): CTAs, active states, brand accent
- **Orange Muted** (`--color-accent-secondary` | `#e89548`): Hover highlights, secondary elements
- **Orange Glow** (`--color-accent-glow` | `rgba(249, 126, 26, 0.15)`): Drop shadow glow

### Neutral Scale
- **Text Primary** (`--color-text-primary` | `#ffffff`): Headings, body
- **Text Secondary** (`--color-text-secondary` | `#dedede`): Secondary text
- **Text Muted** (`--color-text-muted` | `#afafaf`): Captions, metadata
- **Text Dark** (`--color-text-dark` | `#626262`): Subheadings, labels

### Surface & Borders
- **Background** (`--color-bg-primary` | `#253847`): Main slate-blue background
- **Surface Secondary** (`--color-bg-secondary` | `#171717`): Section wrapper card bg
- **Surface Primary** (`--color-surface-primary` | `#141414`): Outer card container
- **Surface Input** (`--color-surface-secondary` | `#262626`): Input field background
- **Surface Elevated** (`--color-surface-elevated` | `#3d3d3d`): Popover/Tooltip surface
- **Border Soft** (`--color-border-soft` | `rgba(255, 255, 255, 0.08)`): Dividers, card borders
- **Border Strong** (`--color-border-strong` | `rgba(255, 255, 255, 0.15)`): Hover borders

## 3. Typography Rules

### Font Family
Primary: Inter, fallback: system-ui, sans-serif. Body: Manrope. Label/Menu: Plus Jakarta Sans. Code: JetBrains Mono.

### Hierarchy
| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display | Inter | 2.5-4.5rem | 700 / 900 | 1.05 | -0.025em | Hero headlines, H1, H2 |
| Body | Manrope | 1-1.125rem | 400 / 500 | 1.65 | 0 | Paragraphs, lists, marketing prose |
| Label/Menu| Plus Jakarta Sans | 1rem | 500 / 700 | 1.5 | 0 | Menu links, quotes, labels |
| Code | JetBrains Mono| 0.875rem | 500 | 1.6 | 0 | Mock Code, stats |

### Principles
- Extra-bold display weight communicates confidence
- Never use light or thin weights — DXBMARK is not delicate

## 4. Component Stylings

### Buttons
- **Primary**: bg `--color-accent-primary`, text `#FFFFFF`, focus ring `2px` accent-orange
- **Secondary**: bg `transparent`, border soft, text `--color-text-secondary`

### Cards & Containers
- bg `--color-bg-secondary`, border `1px solid var(--color-border-soft)`, radius `16px-24px`, padding `24px`
- Shadows: `--shadow-card` (`0 12px 30px -10px rgba(0, 0, 0, 0.7)`)

### Navigation
- Top nav bg `--color-bg-primary`, border-bottom soft

## 5. Layout Principles

### Spacing System
- **24px** — Section inner spacing / Grid gap (`gap-6`)
- **40px-60px** — Mobile vertical margins
- **60px-80px** — Tablet vertical margins
- **80px-120px** — Desktop vertical margins

### Grid & Container
- Max width 1200px (`max-w-7xl` with `px-6` padding). Bento grids use `grid-cols-1 md:grid-cols-3`.

### Whitespace Philosophy
Bold typography + dark bg = let whitespace breathe. Don't compress.

### Border Radius Scale
- **Sm** (4px)
- **Md** (8px)
- **Lg** (16px)
- **Xl** (24px)
- **Full** (9999px)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | `none` | Background |
| Raised | `0 12px 30px -10px rgba(0, 0, 0, 0.7)` | Cards |
| Glow | `0 0 50px 10px rgba(249, 126, 26, 0.15)` | Highlights |

## 7. Do's and Don'ts

### Do
- Use orange boldly for CTAs and brand accent moments
- Keep headlines at 700–900 weight — bold is the brand
- Maintain a 4.5:1 contrast ratio against dark background surfaces
- Use focus rings (`focus-visible:ring-2 focus-visible:ring-accent-orange`)
- Use `aria-hidden="true"` on icons and specific `<label>` tags for forms.

### Don't
- Don't soften the design with gradients or pastels
- Don't use light backgrounds anywhere
- Don't use inline `style={{ ... }}` attributes or hidden CSS
- Don't use hardcoded hex colors or spacing values that bypass design tokens.

## 8. Responsive Behavior & Motion

### Breakpoints
- Tailwind default breakpoints apply

### Motion
- **GSAP Timelines:** Triggered only on scroll viewport entries (`ScrollTrigger`). Durations `0.6s-0.8s`, `"power3.out"`.
- **Logo Loop Marquee:** Infinite linear transform translation (`translateX`).
- **Reduced Motion:** Remove `y` offset values from fade animations, disable infinite translation on marquees.

---
Built with ❤️ by [DXBMARK LLC](https://dxbmark.com/)