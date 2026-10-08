import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAutoplay } from "./use-autoplay";

// Whether the mockup is on screen and whether the visitor asked for less
// motion, set per test.
const screen = vi.hoisted(() => ({ inView: true, reduce: false }));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useInView: () => screen.inView,
  useReducedMotion: () => screen.reduce,
}));

const DURATIONS = [1, 2, 3] as const;
const ref = { current: null };

describe("useAutoplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    screen.inView = true;
    screen.reduce = false;
  });
  afterEach(() => vi.useRealTimers());

  it("steps through each phase after that phase's own duration", () => {
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    expect(result.current.phase).toBe(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.phase).toBe(1);
    act(() => vi.advanceTimersByTime(1999));
    expect(result.current.phase).toBe(1);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.phase).toBe(2);
  });

  // Each phase arms the next timer after it renders, so time moves on one
  // phase at a time, the way it does in the browser.
  const playThrough = (seconds: readonly number[]) => {
    for (const s of seconds) act(() => vi.advanceTimersByTime(s * 1000));
  };

  it("loops back to the start after holding the last phase", () => {
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    playThrough([1, 2]);
    expect(result.current.phase).toBe(2);
    playThrough([3]);
    expect(result.current.phase).toBe(0);
  });

  it("holds the last phase when looping is off", () => {
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS, { loop: false }));
    playThrough([1, 2, 3, 3, 3]);
    expect(result.current.phase).toBe(2);
  });

  it("waits while the mockup is off screen", () => {
    screen.inView = false;
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.phase).toBe(0);
    expect(result.current.playing).toBe(false);
  });

  it("stops for good once someone picks a phase by hand", () => {
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    act(() => result.current.setPhase(1));
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.phase).toBe(1);
    expect(result.current.playing).toBe(false);
  });

  it("starts playing again from the top after restart", () => {
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    act(() => result.current.setPhase(2));
    act(() => result.current.restart());
    expect(result.current.phase).toBe(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.phase).toBe(1);
  });

  it("shows the final phase, and stays there, under reduced motion", () => {
    screen.reduce = true;
    const { result } = renderHook(() => useAutoplay(ref, DURATIONS));
    expect(result.current.phase).toBe(2);
    act(() => vi.advanceTimersByTime(10_000));
    expect(result.current.phase).toBe(2);
  });
});
