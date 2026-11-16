"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/Button";
import { DownloadIcon } from "@/components/icons";
import { addToHistory, loadHistory, removeFromHistory, type HistoryEntry } from "@/lib/history";
import { downloadImage, styleMe, StylistError, type DemoReason } from "@/lib/stylist";
import type { RenderedLook, Selection } from "@/lib/types";
import ProfilePanel from "./ProfilePanel";
import OccasionPanel from "./OccasionPanel";
import Stage from "./Stage";
import LookPanels from "./LookPanels";
import LookDetails from "./LookDetails";
import BottomBar from "./BottomBar";
import HistoryDrawer from "./HistoryDrawer";

export type Phase =
  | { status: "idle" }
  | { status: "styling" }
  | { status: "results"; looks: RenderedLook[]; demo?: DemoReason }
  | { status: "error"; message: string };

export default function Studio() {
  const [selection, setSelection] = useState<Selection>({ kind: "preset", id: "date" });
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const [selected, setSelected] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => setHistory(loadHistory()), []);

  const canStyle =
    phase.status !== "styling" && (selection.kind === "preset" || selection.text.trim().length > 2);

  const run = useCallback(async () => {
    if (!canStyle) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase({ status: "styling" });
    setSelected(0);
    try {
      const { looks, demo } = await styleMe(selection, controller.signal);
      setPhase({ status: "results", looks, demo });
      if (!demo) setHistory(addToHistory(selection, looks));
    } catch (err) {
      if (controller.signal.aborted) return;
      setPhase({
        status: "error",
        message:
          err instanceof StylistError
            ? err.message
            : "The studio hit a snag while dressing you. Give it another go in a moment.",
      });
    }
  }, [canStyle, selection]);

  const looks = phase.status === "results" ? phase.looks : null;
  const current = looks?.[selected] ?? null;

  const openEntry = useCallback((entry: HistoryEntry) => {
    abortRef.current?.abort();
    setPhase({ status: "results", looks: entry.looks });
    setSelected(0);
    setHistoryOpen(false);
  }, []);

  const closeHistory = useCallback(() => setHistoryOpen(false), []);

  const exportLooks = async () => {
    if (!looks) return;
    for (const [i, look] of looks.entries()) {
      if (look.imageUrl) await downloadImage(look.imageUrl, `kiim-look-${i + 1}-${look.id}.jpg`);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col gap-3 p-3 overflow-x-clip lg:h-dvh lg:min-h-0 lg:overflow-clip">
      <header className="flex h-12 shrink-0 items-center justify-between px-3">
        <Logo />
        <span className="label hidden sm:block">Avatar studio</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setHistoryOpen(true)}>
            History
            {history.length > 0 && <span className="text-muted tabular-nums">{history.length}</span>}
          </Button>
          <Button size="sm" onClick={exportLooks} disabled={!looks} aria-label="Export all three looks">
            <DownloadIcon width={15} height={15} />
            Export
          </Button>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-3 lg:min-h-0 lg:grid-cols-[264px_minmax(0,1fr)_288px]">
        <aside className="glass order-3 flex flex-col gap-6 rounded-[22px] p-5 lg:order-1 lg:min-h-0 lg:overflow-y-auto">
          <ProfilePanel />
          <OccasionPanel selection={selection} onSelect={setSelection} onSubmit={run} disabled={phase.status === "styling"} />
        </aside>

        <section className="relative order-1 flex flex-col items-center gap-4 lg:order-2 lg:min-h-0 lg:flex-row lg:justify-center lg:gap-5 lg:py-2 lg:[container-type:size]">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <Stage phase={phase} look={current} index={selected} onRetry={run} />
          <LookPanels phase={phase} selected={selected} onSelect={setSelected} />
        </section>

        <aside className="glass order-2 rounded-[22px] p-5 lg:order-3 lg:min-h-0 lg:overflow-y-auto">
          <LookDetails phase={phase} look={current} index={selected} />
        </aside>
      </main>

      <HistoryDrawer
        open={historyOpen}
        entries={history}
        onClose={closeHistory}
        onOpenEntry={openEntry}
        onRemove={(id) => setHistory(removeFromHistory(id))}
      />

      <BottomBar selection={selection} onSelect={setSelection} onStyle={run} canStyle={canStyle} styling={phase.status === "styling"} />
    </div>
  );
}
