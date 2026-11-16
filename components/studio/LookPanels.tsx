"use client";

import { AnimatePresence, motion } from "framer-motion";
import Photo from "@/components/Photo";
import { cn } from "@/lib/cn";
import { lookLabel } from "@/lib/occasions";
import { LOOK_IMAGE_SIZES } from "@/lib/stylist";
import type { Phase } from "./Studio";

type Props = {
  phase: Phase;
  selected: number;
  onSelect: (i: number) => void;
};

const SLOTS = [0, 1, 2];

export default function LookPanels({ phase, selected, onSelect }: Props) {
  const visible = phase.status === "styling" || phase.status === "results";
  const looks = phase.status === "results" ? phase.looks : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="panels"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="panels-col no-scrollbar -mx-3 flex w-[calc(100%+24px)] snap-x snap-mandatory gap-3 overflow-x-auto px-3 lg:mx-0 lg:h-full lg:snap-none lg:flex-col lg:overflow-visible lg:px-0"
          role="listbox"
          aria-label="Your three looks"
        >
          {SLOTS.map((i) => {
            const look = looks?.[i];
            const active = Boolean(look) && i === selected;
            return (
              <motion.button
                key={i}
                type="button"
                role="option"
                aria-selected={active}
                disabled={!look}
                data-cursor={look ? "hover" : undefined}
                onClick={() => onSelect(i)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * i, ease: "easeOut" }}
                className={cn(
                  "relative aspect-[3/4] w-[46%] shrink-0 snap-start overflow-hidden rounded-[18px] border bg-surface text-left transition-[border-color,box-shadow] duration-300 sm:w-[30%] lg:w-full",
                  active
                    ? "border-accent/70 shadow-[0_0_0_1px_rgb(255_106_43/0.35),0_10px_40px_-12px_rgb(255_106_43/0.45)]"
                    : "border-line hover:border-white/20",
                  !look && "shimmer",
                )}
              >
                {look ? (
                  <>
                    <Photo src={look.imageUrl} alt={look.title} sizes={LOOK_IMAGE_SIZES} className="object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <span className={cn("label block !text-[10px]", active && "!text-accent-2")}>{lookLabel(i, look.mood)}</span>
                      <span className="serif mt-1 block text-[19px] leading-[1.05]">{look.title}</span>
                      <span className="mt-1 line-clamp-2 block text-[11.5px] leading-snug text-text/65">{look.note}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3">
                    <span className="h-2 w-16 rounded-full bg-white/[0.06]" />
                    <span className="h-3 w-24 rounded-full bg-white/[0.08]" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
