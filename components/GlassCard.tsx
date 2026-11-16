import { cn } from "@/lib/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "aside";
};

export default function GlassCard({ as: Tag = "div", className, ...rest }: GlassCardProps) {
  return <Tag className={cn("glass rounded-[22px]", className)} {...rest} />;
}
