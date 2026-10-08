import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/*
  What jsdom leaves out and the site relies on. Each stand-in is the smallest
  thing that lets the real code run: observers report the element as on
  screen, media queries match nothing unless a test says otherwise, and
  scrolling is a no-op.
*/

afterEach(() => cleanup());

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    // Everything counts as in view, so reveals show and mockups play.
    queueMicrotask(() =>
      this.callback(
        [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      )
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.assign(globalThis, {
  IntersectionObserver: MockIntersectionObserver,
  ResizeObserver: MockResizeObserver,
});

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

window.scrollTo = vi.fn() as typeof window.scrollTo;
Element.prototype.scrollIntoView = vi.fn();

if (!("requestIdleCallback" in window)) {
  Object.assign(window, {
    requestIdleCallback: (cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0) as unknown as number,
    cancelIdleCallback: (id: number) => clearTimeout(id),
  });
}
