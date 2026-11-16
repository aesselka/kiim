"use client";

import { AnimatePresence, motion } from "framer-motion";
import Photo from "@/components/Photo";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { lookLabel } from "@/lib/occasions";
import { LOOK_IMAGE_SIZES } from "@/lib/stylist";
import { AVATAR_IMAGE } from "@/lib/site";
import type { RenderedLook } from "@/lib/types";
import type { Phase } from "./Studio";

type Props = {
  phase: Phase;
  look: RenderedLook | null;
  index: number;
  onRetry: () => void;
};

export default function Stage({ phase, look, index, onRetry }: Props) {
  const src = look?.imageUrl ?? AVATAR_IMAGE;
  const styling = phase.status === "styling";

  return (
    <motion.div
      layout
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="stage-box relative aspect-[3/4] w-full max-w-[420px] shrink-0 lg:max-w-none"
    >
      <div
        className="animate-breathe pointer-events-none absolute inset-[-18%] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_43/0.38),rgb(255_180_138/0.10)_55%,transparent)] blur-2xl"
        aria-hidden
      />

      <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-line bg-surface">
        <AnimatePresence initial={false}>
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Photo
              src={src}
              alt={look ? `${look.title} look` : "Avatar"}
              sizes={LOOK_IMAGE_SIZES}
              priority
              className="object-top"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" aria-hidden />
        <div className="pointer-events-none absolute inset-3 rounded-[16px] border border-dashed border-white/10" aria-hidden />
        <Corners active={styling} />

        <AnimatePresence>
          {styling && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-bg/25" />
              <div className="animate-scan absolute inset-x-0 h-24 -translate-y-full bg-gradient-to-b from-transparent to-accent/20">
                <div className="absolute inset-x-0 bottom-0 h-px bg-accent shadow-[0_0_18px_2px_rgb(255_106_43/0.7)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="label rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-text/80 backdrop-blur-md">
            {look ? lookLabel(index, look.mood) : "Soul ID · Ready"}
          </span>
          {phase.status === "results" && phase.demo && (
            <span
              className="label max-w-[60%] rounded-full border border-accent/30 bg-black/40 px-3 py-1.5 text-right !text-accent-2 backdrop-blur-md"
              title={DEMO_NOTE[phase.demo]}
            >
              Lookbook preview
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {phase.status === "styling" && (
              <Caption key="styling">
                <p className="text-[15px] text-text/90">
                  Your stylist is putting looks together<span className="text-accent">…</span>
                </p>
              </Caption>
            )}
            {phase.status === "results" && look && (
              <Caption key={look.id}>
                <p className="serif text-[34px] leading-none sm:text-[40px]">{look.title}</p>
                {phase.demo && <p className="mt-2 max-w-[38ch] text-[13px] text-text/65">{DEMO_NOTE[phase.demo]}</p>}
              </Caption>
            )}
            {phase.status === "error" && (
              <Caption key="error">
                <p className="serif text-[30px] leading-none">That one didn&apos;t come through.</p>
                <p className="mt-2 max-w-[34ch] text-[14px] text-text/70">{phase.message}</p>
                <Button size="sm" className="mt-4" onClick={onRetry}>
                  Try again
                </Button>
              </Caption>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const DEMO_NOTE = {
  limit: "Today's studio sessions are used up, so you're seeing looks from the lookbook.",
  unavailable: "The live studio is resting, so you're seeing looks from the lookbook.",
};

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Corners({ active }: { active: boolean }) {
  const corner = "absolute size-5 border-accent-2 transition-opacity duration-500";
  return (
    <div className={cn("pointer-events-none absolute inset-2", active ? "opacity-90" : "opacity-40")} aria-hidden>
      <span className={cn(corner, "left-0 top-0 rounded-tl-[14px] border-l border-t")} />
      <span className={cn(corner, "right-0 top-0 rounded-tr-[14px] border-r border-t")} />
      <span className={cn(corner, "bottom-0 left-0 rounded-bl-[14px] border-b border-l")} />
      <span className={cn(corner, "bottom-0 right-0 rounded-br-[14px] border-b border-r")} />
    </div>
  );
}
