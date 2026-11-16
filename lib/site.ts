import type { Mood } from "./types";

export const PROFILE_NAME = "Assel";

export const AUTHORS = ["Assel"];

export const AVATAR_IMAGE = "/avatar/base.jpg";

export const HERO_IMAGE = "/lookbook/paris-bold.webp";

/** A real studio run: one wish typed into "Your own", three looks back. */
export const EXAMPLE_RUN = {
  wish: "A date — with yellow flowers.",
  looks: [
    { index: 1, mood: "Bold", title: "The Statement", src: "/lookbook/paris-bold.webp" },
    { index: 2, mood: "Effortless", title: "The Easy One", src: "/lookbook/paris-effortless.webp" },
  ] satisfies { index: number; mood: Mood; title: string; src: string }[],
};

/** Shown in demo mode when a preset's own lookbook photo has not been rendered yet. */
export const DEMO_FALLBACK: Record<Mood, string> = {
  Classic: "/lookbook/paris-classic.webp",
  Bold: "/lookbook/paris-bold.webp",
  Effortless: "/lookbook/paris-effortless.webp",
};
