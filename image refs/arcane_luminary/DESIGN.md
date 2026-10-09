---
name: Arcane Luminary
colors:
  surface: '#15111f'
  surface-dim: '#15111f'
  surface-bright: '#3b3746'
  surface-container-lowest: '#0f0c19'
  surface-container-low: '#1d1a27'
  surface-container: '#211e2b'
  surface-container-high: '#2b2836'
  surface-container-highest: '#363341'
  on-surface: '#e7dff3'
  on-surface-variant: '#d4c4ae'
  inverse-surface: '#e7dff3'
  inverse-on-surface: '#322e3d'
  outline: '#9c8f7a'
  outline-variant: '#504534'
  surface-tint: '#fbbc36'
  primary: '#ffd893'
  on-primary: '#412d00'
  primary-container: '#f5b731'
  on-primary-container: '#684a00'
  inverse-primary: '#7c5800'
  secondary: '#ffb4ac'
  on-secondary: '#690007'
  secondary-container: '#921517'
  on-secondary-container: '#ff9f95'
  tertiary: '#b8e3ff'
  on-tertiary: '#00354a'
  tertiary-container: '#6bccff'
  on-tertiary-container: '#005575'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea6'
  primary-fixed-dim: '#fbbc36'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#8e1214'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#15111f'
  on-background: '#e7dff3'
  surface-variant: '#363341'
typography:
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: 0.02em
  headline-xl-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: 0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: 0.015em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0.005em
  title-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-md:
    fontFamily: Outfit
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system channels an ethereal collegiate wizarding world infused with contemporary technical precision. Designed for a high-energy flagship annual festival, the aesthetic balances dark gothic grandeur, mystical illumination, and high-performance digital functionality.

### Personality & Emotional Response
The interface must evoke wonder, arcane authority, and cinematic immersion. Every touchpoint feels like interacting with an ancient magical relic engineered with modern digital clarity:
- **Atmospheric & Immersive:** Midnight obsidian expanses punctuated by bioluminescent spells, celestial nebulae, and drifting golden embers.
- **Regal & Scholastic:** Evoking historic enchanted academies—vaulted corridors, ancient tomes, and gilded manuscript margins.
- **Contemporary Polish:** Clean layout rhythms, accessible typography, and smooth tactile micro-interactions that keep festival logistics (schedules, passes, registrations) effortlessly legible.

### Design Movement: Gothic Arcane Glassmorphism
The aesthetic synthesizes dark glassmorphism with tactile medieval accents. Translucent obsidian surfaces sit above volumetric misty gradients, rimmed by fine gold-leaf strokes, glowing runic accents, and delicate ambient light blooms (*Lumos Glow*).

## Colors

The color architecture is built strictly on deep, light-absorbing atmospheric backdrops illuminated by spectral glows and gilded accents.

### Palette Architecture
- **Primary (`#F5B731` — Lumos Gold):** Used for critical conversion targets, active states, key headers, and luminous hover halos. Paired with `#FFD269` for inner bevel glows and highlights.
- **Secondary (`#991B1B` — House Crimson):** Evokes solemn scholastic prestige. Used for secondary badges, alert states, house markers, and dramatic gradient underlays.
- **Tertiary (`#38BDF8` — Patronus Mist):** A cool ethereal cyan used for subtle spectral accents, magical state indicators, interactive particle highlights, and floating tags.
- **Neutral (`#0D0A17` — Gothic Obsidian):** The foundational cosmic void. Augmented by deep vault slate (`#171326`) for elevated panels and parchment ivory (`#F7F2E7`) for crisp, legible body text.

### Color Rules & Surface Tokens
- **Canvas Base:** `#08070D` (Solid dark background).
- **Surface Elevation 1 (Card/Container):** `rgba(23, 19, 38, 0.72)` with backdrop blur.
- **Surface Elevation 2 (Floating/Dropdowns):** `rgba(30, 24, 48, 0.85)` with backdrop blur.
- **Border Gold Foil:** `rgba(212, 175, 55, 0.28)` default, increasing to `rgba(245, 183, 49, 0.65)` on active or hover states.
- **Text Primary:** `#F7F2E7` (Parchment Ivory) to ensure a minimum 12:1 contrast ratio against obsidian backdrops.
- **Text Muted:** `rgba(247, 242, 231, 0.62)`.

## Typography

Typography establishes tension between historic academic majesty and ultra-modern digital utility.

### Hierarchy & Treatment
- **Display & Headlines (`EB Garamond`):** Classical proportions, refined serifs, and regal authority. All level headlines above 28px must utilize discretionary tracking (`0.01em - 0.02em`) to echo inscribed roman letterforms.
- **Interface & Content (`Outfit`):** Geometric sans-serif engineered for ultra-crisp display rendering on dark OLED and high-resolution screens. It delivers clean readability for event rules, technical requirements, schedules, and form fields.
- **Runic Metadata:** All `label-*` tokens must use uppercase transformation with increased letter-spacing (`0.06em - 0.08em`) to resemble catalog marks or grimoire annotations.

## Layout & Spacing

Layouts follow an intentional cadence of breathing room to preserve the expansive cinematic scale of castle vaults and celestial expanses.

### Grid Framework
- **Desktop (1024px+):** 12-column responsive fluid grid with max content width constrained to `1280px`. Outer margin: `3rem` (`margin`), column gutters: `1.5rem` (`gutter`).
- **Tablet (768px – 1023px):** 8-column grid with `2rem` margins and `1.25rem` gutters.
- **Mobile (< 768px):** 4-column grid with `1.25rem` outer margins (`margin-mobile`) and `1rem` gutters (`gutter-sm`).

### Vertical Rhythm
Section blocks adhere to generous vertical separation (`space-xl` to `5rem`), preventing information overcrowding and giving hero graphics, parallax spires, and glow trails room to diffuse naturally.

## Elevation & Depth

Depth is established through physical luminance and optical diffusion rather than standard drop shadows. In this midnight world, light originates from the elements themselves.

### Surface Tiers & Blurring
- **Level 0 (Canvas):** Pure cosmic obsidian `#08070D` with static radial ambient glows (`rgba(153, 27, 27, 0.12)` and `rgba(245, 183, 49, 0.08)`).
- **Level 1 (Card/Container):** Dark vault surface `rgba(23, 19, 38, 0.7)` with `backdrop-filter: blur(16px)` and an inner 1px gilded border stroke `rgba(212, 175, 55, 0.22)`.
- **Level 2 (Floating Overlays/Pills):** Frosted glass `rgba(13, 10, 23, 0.85)` with `backdrop-filter: blur(24px) saturate(180%)`, rimmed with dual box-shadow:
  - Specular rim light: `inset 0 1px 1px 0 rgba(255, 210, 105, 0.35)`
  - Diffuse ambient glow: `0 12px 32px -4px rgba(8, 7, 13, 0.8), 0 0 24px -2px rgba(245, 183, 49, 0.15)`

### Glow Casts (Lumos Bloom)
Interactive focal points (primary CTA, active filters, quest cards) cast colored outer glows:
- Gold Bloom: `0 0 20px rgba(245, 183, 49, 0.45), 0 0 40px rgba(245, 183, 49, 0.2)`
- Patronus Bloom: `0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.15)`

## Shapes

The interface blends structural discipline with curved mystical talismans.
- **Base Components (Cards, Inputs, Panels):** Follow roundedness level `2` (`0.5rem` / `8px` default corner radius) to maintain structural architectural discipline.
- **Specialized Arcane Elements (Pills, Navigation Bar, Tags, Action Chips):** Use full pill radius (`9999px`) to create an aesthetic contrast against angular architectural grids, referencing amulets, wands, and ancient vials.
- **Borders & Filigree:** Borders never exceed `1px` to `1.5px` in stroke width. Thicker strokes break the optical illusion of delicate gilded metalwork.

## Components

### Navigation Bar
- **Form:** Floating pill container docked top-center with `space-md` clearance from viewport edges.
- **Material:** Ultra-frosted obsidian glass (`rgba(13, 10, 23, 0.82)`, `backdrop-filter: blur(20px)`).
- **Accents:** Delicate border stroke with gold gradient (`rgba(212, 175, 55, 0.4)` fading to `rgba(212, 175, 55, 0.1)`), and an ambient amber underglow. Navigation links render in `label-md` with parchment ivory hover transitions.

### Buttons
- **Primary CTA (Lumos Gold):** Solid gradient fill from `#FFD269` to `#F5B731`, text in `#08070D` (`fontWeight: 600`), pill or rounded-md radius. On hover: radiates a 24px gold bloom and subtle vertical translate (`-1px`).
- **Secondary CTA (Enchanted Glass):** Frosted glass surface (`rgba(255, 255, 255, 0.05)`), 1px gilded border (`rgba(212, 175, 55, 0.4)`), text in `#F7F2E7`. On hover: border brightens to `#F5B731` with a faint interior gold wash (`rgba(245, 183, 49, 0.12)`).

### Cards & Event Panels
- **Container:** Dark vault slate with 16px blur backdrop.
- **Accent Header:** Subtle gradient divider bar or gilded runic corner notches.
- **Hover State:** Border transitions from subtle bronze (`rgba(212, 175, 55, 0.2)`) to glowing lumos gold (`rgba(245, 183, 49, 0.7)`), accompanied by a warm background tint shift.

### Wax Seal Badges & Status Chips
- **Chips:** Pill-shaped markers with 1px border. Categories use house pigments (Crimson for Flagship events, Slytherin Emerald `#10B981` for Technical hacks, Patronus Cyan for Workshops).
- **Wax Seals:** Circular emblems featuring high-contrast embossed house crests, rendered in deep vermilion or burnished bronze with an inset radial highlight.

### Input Fields
- **Surface:** `rgba(8, 7, 13, 0.65)` inset background with `1px` border in `rgba(212, 175, 55, 0.25)`.
- **Focus:** Crisp border transition to `#F5B731` accompanied by a soft `0 0 12px rgba(245, 183, 49, 0.25)` ambient field glow. Placeholder text styled in muted ivory parchment.

### Interactive Micro-details
- **Custom Cursor:** Minimalist silver wand tip pointer accompanied by a decaying particle spark trail (`rgba(245, 183, 49, 0.6)` and `rgba(165, 243, 252, 0.8)`).
- **Parallax Layers:** Background stars and floating candles set to subtle `translateY` scroll velocity modifiers (0.1x to 0.4x) relative to foreground content.