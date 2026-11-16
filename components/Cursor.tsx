"use client";

import { useEffect, useRef, useState } from "react";

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
const EASE = 0.12;

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!enabled || !dot || !glow) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...mouse };
    let visible = false;
    let frame = 0;

    const setVisible = (value: boolean) => {
      visible = value;
      dot.classList.toggle("is-visible", value);
      glow.classList.toggle("is-visible", value);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        setVisible(true);
      }
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      dot.classList.toggle("is-hover", Boolean(target?.closest('[data-cursor="hover"]')));
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      pos.x += (mouse.x - pos.x) * EASE;
      pos.y += (mouse.y - pos.y) * EASE;
      glow.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
