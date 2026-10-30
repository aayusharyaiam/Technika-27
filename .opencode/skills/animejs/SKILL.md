---
name: animejs
description: "Versatile JavaScript animation engine for DOM, CSS, SVG, and JavaScript objects. Use when creating timeline-based animations, stagger effects, SVG morphing, keyframe sequences, scroll choreography, or complex animations with Anime.js."
---

# Anime.js

Use Anime.js for framework-agnostic web animation involving DOM elements, CSS properties, SVG attributes, JavaScript objects, timelines, staggered sequences, path following, or SVG morphing.

## When to use

- Timeline-based choreography with relative offsets.
- Staggered reveals and grid animations.
- SVG line drawing, path following, and path morphing.
- Keyframe sequences, spring easing, steps, and custom cubic bezier easing.
- Vanilla JavaScript, React, Vue, or other frameworks where a framework-independent engine is appropriate.

## Core patterns

```javascript
import anime from 'animejs'

anime({
  targets: '.element',
  translateX: 250,
  rotate: '1turn',
  duration: 800,
  easing: 'easeInOutQuad'
})
```

Use selectors, DOM elements, element arrays, or JavaScript objects as targets. Animate individual transform properties such as `translateX`, `translateY`, `scale`, and `rotate` rather than assigning a complete CSS `transform` string.

### Stagger

```javascript
anime({
  targets: '.item',
  translateY: [40, 0],
  opacity: [0, 1],
  delay: anime.stagger(100),
  duration: 600,
  easing: 'easeOutQuad'
})
```

For grid choreography, use `anime.stagger(delay, { grid: [columns, rows], from: 'center', axis: 'x' })` when appropriate.

### Timelines

```javascript
const timeline = anime.timeline({ duration: 750, easing: 'easeOutExpo' })

timeline
  .add({ targets: '.title', translateY: [-50, 0], opacity: [0, 1] })
  .add({ targets: '.subtitle', translateY: [-30, 0], opacity: [0, 1] }, '-=500')
  .add({ targets: '.button', scale: [0, 1], opacity: [0, 1] }, '-=300')
```

Use `'-=500'` and `'+=200'` for relative timing. A plain numeric string is an absolute timeline position, not a relative offset.

### SVG

```javascript
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  duration: 2000,
  easing: 'easeInOutQuad'
})
```

Use `d` values for compatible SVG path morphing and `anime.path('#motion-path')` for path-following `translateX`, `translateY`, and `rotate` values.

## Framework integration

In React, create animations inside `useEffect`, target a `useRef`, and pause or clean up the animation on unmount. In Vue, initialize after mount and clean up when the component is destroyed. Verify the installed Anime.js version and its import style before coding because APIs can differ between major versions.

```javascript
useEffect(() => {
  const animation = anime({
    targets: ref.current,
    translateX: 250,
    duration: 800,
    easing: 'easeInOutQuad'
  })

  return () => animation.pause()
}, [])
```

## Performance and accessibility

- Prefer `transform` and `opacity`; avoid repeatedly animating layout-triggering properties such as `width`, `height`, `left`, and `top`.
- Batch matching targets into one animation instead of creating hundreds of separate animations.
- Avoid animating very large element sets; use CSS animations or virtualization when suitable.
- Use `will-change` sparingly for complex animations and remove it when no longer needed.
- Use `autoplay: false` for manually controlled scroll animations rather than starting work for offscreen content.
- Respect `prefers-reduced-motion`; provide a reduced or instant state for users who request less motion.
- Do not use animation as the only way to communicate meaning, status, or navigation.
- Avoid unnecessary infinite loops because they consume battery and attention; prefer CSS for simple perpetual effects.

## Playback controls

Animation instances support controls such as `play()`, `pause()`, `restart()`, `reverse()`, and `seek(milliseconds)`. Use these controls for user-driven or scroll-driven experiences and ensure event listeners are removed during cleanup.

## Common pitfalls

- Include explicit units where the property requires them, such as `'200px'` for width.
- Do not animate the full `transform` string; use individual transform properties.
- Clean up animations and scroll listeners when components unmount.
- Avoid excessive simultaneous animations and infinite loops.
- Verify that SVG morph paths are compatible and that path drawing targets have the required stroke setup.

## Choosing an alternative

Use Anime.js for SVG-heavy, simpler, or framework-agnostic animation. Consider GSAP for advanced scroll-driven experiences and professional-grade timeline control, or a React-specific declarative library when React gestures and component state are central to the interaction.

## Delivery checklist

- [ ] Animation uses the project’s installed Anime.js API and import style.
- [ ] React/Vue lifecycle cleanup is implemented where applicable.
- [ ] Transform and opacity are preferred over layout-triggering properties.
- [ ] Reduced-motion behavior is supported.
- [ ] Scroll listeners and manual animation controls are cleaned up.
- [ ] Timing, stagger, easing, and looping are intentional and tested.
- [ ] Animations do not block core content or communicate meaning through motion alone.
