"use client";

import { Button } from "@/components/Button";
import { ArrowIcon, OCCASION_ICONS } from "@/components/icons";
import { cn } from "@/lib/cn";
import { OCCASIONS } from "@/lib/occasions";
import type { Selection } from "@/lib/types";

type Props = {
  selection: Selection;
  onSelect: (s: Selection) => void;
  onStyle: () => void;
  canStyle: boolean;
  styling: boolean;
};

export default function BottomBar({ selection, onSelect, onStyle, canStyle, styling }: Props) {
  return (
    <div className="glass sticky bottom-3 z-20 flex shrink-0 items-center gap-3 rounded-[22px] p-2 pl-2 lg:static">
      <div className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto" role="radiogroup" aria-label="Occasion">
        {OCCASIONS.map((o) => {
          const Icon = OCCASION_ICONS[o.id];
          const active = selection.kind === "preset" && selection.id === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              data-cursor="hover"
              disabled={styling}
              onClick={() => onSelect({ kind: "preset", id: o.id })}
              className={cn(
                "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors duration-300 disabled:opacity-50",
                active
                  ? "border-accent/50 bg-accent/10 text-text"
                  : "border-line text-muted hover:border-white/20 hover:text-text",
              )}
            >
              <Icon className={active ? "text-accent" : undefined} />
              {o.name}
            </button>
          );
        })}
      </div>
      <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
      <Button onClick={onStyle} disabled={!canStyle} className="h-11 shrink-0 px-5 sm:px-6">
        {styling ? "Styling…" : "Style me"}
        {!styling && <ArrowIcon width={16} height={16} />}
      </Button>
    </div>
  );
}
