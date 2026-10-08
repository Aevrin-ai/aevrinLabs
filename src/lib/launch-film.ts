/*
  The launch film: its files, its length, and one way for any button to start
  it. The hero's "Watch the launch" pill and the film section never import
  each other; the pill sends an event and the section answers it.
*/

export const LAUNCH_FILM = {
  // H.264 at CRF 17 from the 1080p60 master: mean SSIM 0.9991 against it at
  // 11.9 MB. AV1 was tried and needed as many bytes for the same quality on
  // this film, so one file plays everywhere instead.
  src: "/video/launch.mp4",
  poster: "/video/launch-poster.webp",
  posterSmall: "/video/launch-poster-sm.webp",
  length: "1:00",
  lengthLabel: "1 minute",
};

export const VIDEO_TYPE = 'video/mp4; codecs="avc1.64002A, mp4a.40.2"';

const EVENT = "aevrinlabs:play-launch-film";

// Scrolls to the film and starts it.
export function playLaunchFilm() {
  window.dispatchEvent(new Event(EVENT));
}

export function onPlayLaunchFilm(handler: () => void) {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
