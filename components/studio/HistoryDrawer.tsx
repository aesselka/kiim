"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Photo from "@/components/Photo";
import { formatWhen, type HistoryEntry } from "@/lib/history";

type Props = {
  open: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
  onOpenEntry: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
};

export default function HistoryDrawer({ open, entries, onClose, onOpenEntry, onRemove }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Your looks history"
            className="glass fixed inset-y-3 right-3 z-50 flex w-[min(400px,calc(100vw-24px))] flex-col rounded-[22px] !bg-[#111113]/90"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 p-5 pb-3">
              <div>
                <span className="label">History</span>
                <p className="serif mt-1 text-[30px] leading-none">Your looks</p>
              </div>
              <button
                type="button"
                data-cursor="hover"
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-text"
                aria-label="Close history"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {entries.length === 0 ? (
                <p className="px-2 pt-6 text-[14px] leading-relaxed text-muted">
                  Every set of looks you style lands here, so you can come back to it.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {entries.map((entry) => (
                    <li key={entry.id} className="group relative">
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => onOpenEntry(entry)}
                        className="flex w-full gap-3 rounded-2xl border border-transparent p-2 text-left transition-colors hover:border-line hover:bg-white/[0.03]"
                      >
                        <div className="flex shrink-0 gap-1">
                          {entry.looks.slice(0, 3).map((look) => (
                            <div key={look.id} className="relative h-[68px] w-[51px] overflow-hidden rounded-lg bg-surface">
                              <Photo src={look.imageUrl} alt="" sizes="64px" className="object-top" />
                            </div>
                          ))}
                        </div>
                        <div className="min-w-0 flex-1 py-1 pr-6">
                          <p className="line-clamp-2 text-[14px] font-medium leading-snug">{entry.title}</p>
                          <p className="label mt-1.5 !text-[10px]">{formatWhen(entry.createdAt)}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => onRemove(entry.id)}
                        className="absolute right-3 top-3 text-[12px] text-muted opacity-0 transition-opacity hover:text-text focus-visible:opacity-100 group-hover:opacity-100"
                        aria-label={`Remove ${entry.title}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-muted">
              Saved in this browser. Higgsfield keeps photos for about 7 days — save the ones you love.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
