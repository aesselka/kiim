"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button";
import { DownloadIcon } from "@/components/icons";
import { lookLabel } from "@/lib/occasions";
import { downloadImage } from "@/lib/stylist";
import type { RenderedLook } from "@/lib/types";
import type { Phase } from "./Studio";

type Props = {
  phase: Phase;
  look: RenderedLook | null;
  index: number;
};

export default function LookDetails({ phase, look, index }: Props) {
  return (
    <div className="flex h-full flex-col gap-5">
      <span className="label">Look details</span>
      <AnimatePresence mode="wait">
        {look ? (
          <Details key={look.id} look={look} index={index} />
        ) : phase.status === "styling" ? (
          <Skeleton key="skeleton" />
        ) : (
          <Empty key="empty" />
        )}
      </AnimatePresence>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

function Details({ look, index }: { look: RenderedLook; index: number }) {
  return (
    <motion.div {...fade} className="flex flex-1 flex-col gap-6">
      <div>
        <span className="label !text-accent-2">{lookLabel(index, look.mood)}</span>
        <h2 className="serif mt-2 text-[38px] leading-[0.95]">{look.title}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-text/75">“{look.note}”</p>
      </div>

      <div>
        <span className="label">Pieces</span>
        <ol className="mt-2">
          {look.pieces.map((piece, i) => (
            <li key={piece} className="flex items-baseline gap-3 border-b border-line py-2.5 text-[14px] last:border-0">
              <span className="w-5 shrink-0 text-[11px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              {piece}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <span className="label">Palette</span>
        <ul className="mt-3 flex gap-2.5">
          {look.palette.map((hex) => (
            <li key={hex} className="group flex flex-col items-center gap-1.5">
              <span className="size-9 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: hex }} title={hex} />
              <span className="text-[10px] uppercase tracking-[0.06em] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                {hex}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className="mt-auto w-full"
        disabled={!look.imageUrl}
        onClick={() => look.imageUrl && downloadImage(look.imageUrl, `kiim-${look.id}.jpg`)}
      >
        <DownloadIcon width={16} height={16} />
        Save look
      </Button>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <motion.div {...fade} className="flex flex-col gap-4" aria-busy>
      {["w-20", "w-40 h-7", "w-full", "w-3/4"].map((w, i) => (
        <span key={i} className={`shimmer block h-3 rounded-full bg-white/[0.05] ${w}`} />
      ))}
      <div className="mt-4 flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="shimmer size-9 rounded-full bg-white/[0.05]" />
        ))}
      </div>
    </motion.div>
  );
}

function Empty() {
  return (
    <motion.div {...fade}>
      <p className="serif text-[30px] leading-[1]">Where are you going?</p>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        Pick an occasion — or describe your own. Your stylist will put together three looks, classic, bold and
        effortless, and show them on you.
      </p>
    </motion.div>
  );
}
