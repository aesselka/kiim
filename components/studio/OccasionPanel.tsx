"use client";

import { useState } from "react";
import { OCCASION_ICONS, PenIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { CUSTOM_MAX, OCCASIONS } from "@/lib/occasions";
import type { Selection } from "@/lib/types";

type Props = {
  selection: Selection;
  onSelect: (s: Selection) => void;
  onSubmit: () => void;
  disabled: boolean;
};

export default function OccasionPanel({ selection, onSelect, onSubmit, disabled }: Props) {
  const [draft, setDraft] = useState(selection.kind === "custom" ? selection.text : "");
  const customActive = selection.kind === "custom";

  return (
    <div className="flex flex-col gap-4">
      <span className="label">Occasion</span>

      <ul className="hidden flex-col gap-1 lg:flex">
        {OCCASIONS.map((o) => {
          const Icon = OCCASION_ICONS[o.id];
          const active = selection.kind === "preset" && selection.id === o.id;
          return (
            <li key={o.id}>
              <button
                type="button"
                data-cursor="hover"
                disabled={disabled}
                onClick={() => onSelect({ kind: "preset", id: o.id })}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors duration-300 disabled:opacity-50",
                  active ? "border-accent/40 bg-accent/[0.07]" : "border-transparent hover:bg-white/[0.03]",
                )}
              >
                <Icon className={active ? "text-accent" : "text-muted"} />
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium">{o.name}</span>
                  <span className="block truncate text-[12px] text-muted">{o.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={cn(
          "rounded-2xl border p-3 transition-colors duration-300",
          customActive ? "border-accent/40 bg-accent/[0.05]" : "border-line",
        )}
      >
        <label htmlFor="own-occasion" className="flex items-center gap-2 text-[14px] font-medium">
          <PenIcon width={16} height={16} className={customActive ? "text-accent" : "text-muted"} />
          Your own
        </label>
        <textarea
          id="own-occasion"
          rows={3}
          maxLength={CUSTOM_MAX}
          value={draft}
          disabled={disabled}
          placeholder="Gallery opening on Friday, a little artsy"
          onFocus={() => onSelect({ kind: "custom", text: draft })}
          onChange={(e) => {
            setDraft(e.target.value);
            onSelect({ kind: "custom", text: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          className="mt-2 w-full resize-none bg-transparent text-[14px] leading-snug text-text placeholder:text-muted/70 focus:outline-none"
        />
      </form>
    </div>
  );
}
