import type { Mood } from "./types";

export const PROFILE_NAME = "Assel";

export const AUTHORS = ["Assel"];

export const AVATAR_IMAGE = "/avatar/base.jpg";

/** Real studio runs from "Your own", shown on the landing. */
export const EXAMPLE_LOOKS: { label: string; title: string; wish: string; src: string }[] = [
  {
    label: "Look 02 · Bold",
    title: "The Statement",
    wish: "A date — with yellow flowers.",
    src: "/lookbook/paris-bold.webp",
  },
  {
    label: "Your own · Party",
    title: "Lake Como at Sunset",
    wish: "Lake Como, an airy white dress, the sunset on the lake.",
    src: "/lookbook/como.webp",
  },
  {
    label: "Look 03 · Effortless",
    title: "The Easy One",
    wish: "A date — with yellow flowers.",
    src: "/lookbook/paris-effortless.webp",
  },
];

/** Shown in demo mode when a preset's own lookbook photo has not been rendered yet. */
export const DEMO_FALLBACK: Record<Mood, string> = {
  Classic: "/lookbook/paris-classic.webp",
  Bold: "/lookbook/paris-bold.webp",
  Effortless: "/lookbook/paris-effortless.webp",
};
