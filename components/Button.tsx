import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,opacity,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-[#160A04] hover:bg-[#ff7c45]",
  ghost: "border border-line text-text hover:border-white/20 hover:bg-white/[0.04]",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-9 px-4 text-[13px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button data-cursor="hover" className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = CommonProps & { href: string };

export function LinkButton({ variant = "primary", size = "md", className, children, href }: LinkButtonProps) {
  return (
    <Link href={href} data-cursor="hover" className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
