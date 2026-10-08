import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { playLaunchFilm } from "@/lib/launch-film";
import { renderPage } from "@/test/helpers";
import LaunchFilm from "./launch-film";

describe("the launch film", () => {
  it("shows only the poster until someone presses play, so the page loads no video", () => {
    const { container } = renderPage(<LaunchFilm />);
    expect(screen.getByRole("heading", { name: "Meet Aevrinlabs in a minute." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play the Aevrinlabs launch film, 1 minute" })).toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
  });

  it("offers a small poster for phones and the full one for wide screens", () => {
    const { container } = renderPage(<LaunchFilm />);
    const poster = container.querySelector("img")!;
    expect(poster.getAttribute("srcset")).toContain("/video/launch-poster-sm.webp 960w");
    expect(poster.getAttribute("srcset")).toContain("/video/launch-poster.webp 1920w");
  });

  it("swaps in the video when play is pressed", async () => {
    const { container } = renderPage(<LaunchFilm />);
    await userEvent.click(screen.getByRole("button", { name: /Play the Aevrinlabs launch film/ }));
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAccessibleName("Aevrinlabs launch film, 1 minute");
    const sources = [...video.querySelectorAll("source")].map((s) => s.getAttribute("src"));
    expect(sources).toEqual(["/video/launch.mp4"]);
    expect(video.play).toHaveBeenCalled();
    expect(video).toHaveFocus();
  });

  it("starts when the hero's Watch the launch pill asks it to", () => {
    const { container } = renderPage(<LaunchFilm />);
    act(() => playLaunchFilm());
    expect(container.querySelector("video")).not.toBeNull();
  });
});
