// The easing every mockup and reveal shares: quick off the mark, soft landing.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Scroll progress is eased toward where the reader is rather than snapped to
// it, settling in about a third of a second. Every scroll-driven value goes
// through this spring first: without it, Motion hands opacity and filter to
// the browser's scroll timeline while transforms run in JS, and they drift.
export const SCROLL_SPRING = { stiffness: 140, damping: 30, mass: 0.6, restDelta: 0.0001 };
