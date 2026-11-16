import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" data-cursor="hover" className="inline-flex items-baseline gap-1.5 text-[19px] font-semibold tracking-[-0.04em]">
      Kiim
      <span className="text-[11px] text-accent" aria-hidden>
        ✦
      </span>
    </Link>
  );
}
