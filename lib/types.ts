export type OccasionId = "date" | "wedding" | "interview" | "party" | "weekend";

export type Mood = "Classic" | "Bold" | "Effortless";

export type Look = {
  id: string;
  mood: Mood;
  title: string;
  note: string;
  pieces: string[];
  palette: string[];
  prompt: string;
  /** Pre-generated photo in public/lookbook, used on the landing and in demo mode. */
  demoImage?: string;
};

export type Occasion = {
  id: OccasionId;
  name: string;
  hint: string;
  looks: [Look, Look, Look];
};

export type Selection = { kind: "preset"; id: OccasionId } | { kind: "custom"; text: string };

export type RenderedLook = Look & { imageUrl?: string };

/* ---- API contract ---- */

export type GenerateRequest = Selection;

export type GenerateResponse =
  | { mode: "live"; jobs: { lookId: string; requestId: string }[] }
  | { mode: "demo"; reason: "limit" | "unavailable"; looks: { lookId: string; imageUrl: string }[] };

export type JobStatus = "queued" | "in_progress" | "completed" | "failed" | "nsfw";

export type StatusResponse = {
  jobs: { requestId: string; status: JobStatus; imageUrl?: string }[];
};
