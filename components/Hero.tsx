"use client";

import { motion } from "framer-motion";
import { LinkButton } from "./Button";
import { ArrowIcon } from "./icons";
import GlassCard from "./GlassCard";
import Photo from "./Photo";

const ease = [0.22, 1, 0.36, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <Sparkle className="left-[8%] top-[22%] text-[14px]" />
      <Sparkle className="left-[46%] top-[78%] text-[10px]" />
      <Sparkle className="right-[6%] top-[16%] text-[12px]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1280px] items-center gap-14 px-4 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-10">
        <div className="max-w-[640px]">
          <motion.p {...rise(0.05)} className="label">
            AI stylist · Built on Higgsfield Soul
          </motion.p>
          <motion.h1 {...rise(0.12)} className="display mt-6 text-[clamp(52px,8.4vw,112px)]">
            Your stylist,
            <br />
            <span className="serif pr-2 text-accent">wearing</span> you.
          </motion.h1>
          <motion.p {...rise(0.22)} className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-muted sm:text-[18px]">
            Tell Kiim where you&apos;re going — and see yourself in three looks.
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href="/studio">
              Open the studio
              <ArrowIcon width={16} height={16} />
            </LinkButton>
            <LinkButton href="#how" variant="ghost">
              How it works
            </LinkButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[460px]"
        >
          <div
            className="animate-breathe pointer-events-none absolute inset-[-22%] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_43/0.42),rgb(255_180_138/0.10)_55%,transparent)] blur-2xl"
            aria-hidden
          />
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-line bg-surface">
            <Photo alt="" sizes="460px" />
            <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-dashed border-white/10" aria-hidden />
            <div className="animate-scan pointer-events-none absolute inset-x-0 h-24 -translate-y-full bg-gradient-to-b from-transparent to-accent/15" aria-hidden>
              <div className="absolute inset-x-0 bottom-0 h-px bg-accent/80 shadow-[0_0_18px_2px_rgb(255_106_43/0.6)]" />
            </div>
          </div>

          <GlassCard className="absolute -left-2 top-[14%] px-5 py-4 sm:-left-12">
            <p className="text-[30px] font-medium leading-none tracking-[-0.04em]">03 looks</p>
            <p className="label mt-2">per occasion</p>
          </GlassCard>
          <GlassCard className="absolute -right-2 bottom-[12%] px-5 py-4 sm:-right-10">
            <p className="serif text-[26px] leading-none">Soul ID</p>
            <p className="label mt-2">powered by Higgsfield</p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <span className={`pointer-events-none absolute text-accent-2/25 ${className}`} aria-hidden>
      ✦
    </span>
  );
}
