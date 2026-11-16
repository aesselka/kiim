"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { loaderFor } from "@/lib/image-loader";

type PhotoProps = {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

type LoadState = { src?: string; loaded: boolean; direct: boolean; failed: boolean };

export default function Photo({ src, alt, sizes, priority, className }: PhotoProps) {
  const [state, setState] = useState<LoadState>({ src, loaded: false, direct: false, failed: false });

  if (state.src !== src) setState({ src, loaded: false, direct: false, failed: false });

  if (!src || state.failed) return <Silhouette className={className} />;

  // Remote images are resized by /api/image; if that fails, load the original directly.
  const onError = () =>
    setState((s) => (src.startsWith("http") && !s.direct ? { ...s, direct: true } : { ...s, failed: true }));

  return (
    <>
      {!state.loaded && <div className="shimmer absolute inset-0 bg-white/[0.02]" aria-hidden />}
      <Image
        key={state.direct ? "direct" : "optimized"}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={state.direct}
        loader={state.direct ? undefined : loaderFor(src)}
        onLoad={() => setState((s) => ({ ...s, loaded: true }))}
        onError={onError}
        className={cn(
          "object-cover transition-[opacity,filter] duration-700 ease-out",
          state.loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          className,
        )}
      />
    </>
  );
}

function Silhouette({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-end justify-center bg-[radial-gradient(ellipse_at_50%_30%,#1d1a18,#0f0f10_70%)]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 120 160" className="h-[88%] w-auto text-white/15" fill="none">
        <g stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2.4">
          <ellipse cx="60" cy="22" rx="9" ry="11" />
          <path d="M55 33 Q55 38 52 40 L40 45 Q35 47 35 54 L37 82 Q38 86 41 86 L44 60 L45 74 Q46 82 44 90 L36 140 Q35 146 40 146 L80 146 Q85 146 84 140 L76 90 Q74 82 75 74 L76 60 L79 86 Q82 86 83 82 L85 54 Q85 47 80 45 L68 40 Q65 38 65 33" />
          <path d="M50 146 L50 158 M70 146 L70 158" />
        </g>
      </svg>
    </div>
  );
}
