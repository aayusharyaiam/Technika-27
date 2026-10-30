---
name: ui-ux-pro-max
description: "UI/UX design intelligence for website and frontend work. Apply when designing, building, reviewing, fixing, improving, optimizing, enhancing, or refactoring UI/UX, frontend pages, components, layouts, responsive behavior, accessibility, typography, color, animation, dashboards, landing pages, admin panels, e-commerce, SaaS, portfolios, blogs, or mobile interfaces."
---

# UI/UX Pro Max - Design Intelligence

Use this skill whenever changing or creating website UI/UX, frontend code, visual design, responsive layouts, accessibility, typography, color systems, animation, dashboards, landing pages, forms, tables, charts, navigation, cards, modals, or related components.

## Required workflow

1. Analyze the request: identify product type, industry, style keywords, target devices, accessibility needs, and technology stack.
2. Generate a design system before implementation when the bundled UI/UX search tool is available:
   ```bash
   python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "<Project Name>"
   ```
   If the repository does not contain this script, use the principles in this skill directly and do not invent or install it without user request.
3. Use detailed domain searches as needed for style, color, typography, landing-page structure, charts, UX, web accessibility, or stack-specific guidance.
4. Use the project’s actual stack. If no stack is specified and the work is plain HTML, default to `html-tailwind`; otherwise follow the existing project conventions.
5. Implement the smallest complete change, preserving existing behavior and unrelated work.
6. Review the result at common responsive widths and run the project’s relevant checks.

## Priority rules

1. Accessibility: contrast of at least 4.5:1 for normal text, visible focus states, descriptive alt text, labels for form controls, keyboard navigation, and non-color-only status indicators.
2. Touch and interaction: interactive targets should be at least 44x44px, clickable items need clear feedback and `cursor-pointer`, async buttons should show loading and prevent duplicate submission, and errors should appear near the relevant control.
3. Performance: optimize images, reserve space for async content, prefer transform/opacity animations, and respect `prefers-reduced-motion`.
4. Layout: support responsive widths around 375px, 768px, 1024px, and 1440px; avoid horizontal overflow; keep content clear of fixed navigation; use a consistent container width and z-index scale.
5. Typography and color: use readable font sizes, 1.5–1.75 body line-height, 65–75 character line length where practical, and consistent heading/body pairing.
6. Animation: use restrained 150–300ms transitions and avoid layout-shifting hover effects.
7. Visual consistency: match the style to the product, use a consistent icon set, and keep borders, shadows, spacing, and states coherent across pages.
8. Data visualization: match chart type to the data and provide an accessible table or equivalent alternative.

## Common implementation rules

- Do not use emoji as UI icons. Use a consistent SVG icon set such as Lucide or Heroicons.
- Give icon-only buttons an accessible name with `aria-label`.
- Use semantic HTML and correctly associated `<label>` elements.
- Add visible `:focus-visible` styles.
- Provide stable hover states using color, opacity, border, or shadow rather than scale transforms that shift layout.
- Use sufficiently opaque light-mode surfaces and visible borders; avoid low-contrast gray body text.
- Keep a consistent `max-w-6xl`/`max-w-7xl`-style container rather than mixing arbitrary widths.
- Ensure fixed or floating navigation has edge spacing and does not cover content.
- Respect reduced motion and do not make animation the only way to understand state.

## Pre-delivery checklist

- [ ] No emoji used as an icon; icon sizing and icon set are consistent.
- [ ] Clickable elements have clear hover and focus states and do not shift layout.
- [ ] Forms have labels, useful errors, loading states, and keyboard support.
- [ ] Text and borders meet contrast requirements in light and dark themes.
- [ ] Images have appropriate alt text and are optimized when applicable.
- [ ] Responsive behavior works at 375px, 768px, 1024px, and 1440px.
- [ ] No horizontal scrolling or content hidden behind fixed elements.
- [ ] `prefers-reduced-motion` is respected.
- [ ] Relevant project tests, type checks, lint checks, or builds have been run.
