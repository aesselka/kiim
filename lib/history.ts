import { getOccasion, wishKeywords } from "./occasions";
import { PROFILE_NAME } from "./site";
import type { RenderedLook, Selection } from "./types";

/**
 * Generation history, kept in this browser only (the project has no database).
 * Higgsfield keeps the images for ~7 days, so older entries may lose their photos.
 */

export type HistoryEntry = {
  id: string;
  createdAt: number;
  title: string;
  selection: Selection;
  looks: RenderedLook[];
};

const KEY = "kiim:history:v1";
const MAX_ENTRIES = 24;
const ROMAN = ["", " II", " III", " IV", " V", " VI", " VII", " VIII", " IX", " X"];

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* storage full or blocked: history is a convenience, never an error */
  }
}

function baseTitle(selection: Selection, looks: RenderedLook[]) {
  if (selection.kind === "custom") return `${PROFILE_NAME} · ${wishKeywords(selection.text)}`;
  return `${PROFILE_NAME} · ${getOccasion(selection.id).name}, ${looks[0]?.title ?? ""}`.replace(/, $/, "");
}

/** Titles stay unique: a repeat of the same occasion gets II, III… */
function uniqueTitle(base: string, existing: HistoryEntry[]) {
  const taken = new Set(existing.map((e) => e.title));
  for (const suffix of ROMAN) if (!taken.has(base + suffix)) return base + suffix;
  return `${base} · ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function addToHistory(selection: Selection, looks: RenderedLook[]) {
  const existing = loadHistory();
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    title: uniqueTitle(baseTitle(selection, looks), existing),
    selection,
    looks,
  };
  const next = [entry, ...existing].slice(0, MAX_ENTRIES);
  persist(next);
  return next;
}

export function removeFromHistory(id: string) {
  const next = loadHistory().filter((e) => e.id !== id);
  persist(next);
  return next;
}

export function formatWhen(ts: number) {
  return new Date(ts).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
