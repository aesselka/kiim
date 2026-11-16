import type { OccasionId } from "@/lib/types";

type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const DateIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3h8l-.6 5.2a3.4 3.4 0 0 1-6.8 0L8 3Z" />
    <path d="M12 11.6V20M8.5 20h7" />
  </Svg>
);

export const WeddingIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="14" r="5" />
    <circle cx="15" cy="14" r="5" />
    <path d="m10.5 4.5 1.5-1.5 1.5 1.5-1.5 2-1.5-2Z" />
  </Svg>
);

export const InterviewIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
    <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17" />
  </Svg>
);

export const PartyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c.5 4 1.5 5 5.5 5.5-4 .5-5 1.5-5.5 5.5-.5-4-1.5-5-5.5-5.5 4-.5 5-1.5 5.5-5.5Z" />
    <path d="M18 15c.25 2 .75 2.5 2.75 2.75-2 .25-2.5.75-2.75 2.75-.25-2-.75-2.5-2.75-2.75 2-.25 2.5-.75 2.75-2.75Z" />
  </Svg>
);

export const WeekendIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Svg>
);

export const PenIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
  </Svg>
);

export const ArrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const OCCASION_ICONS: Record<OccasionId, (p: IconProps) => React.JSX.Element> = {
  date: DateIcon,
  wedding: WeddingIcon,
  interview: InterviewIcon,
  party: PartyIcon,
  weekend: WeekendIcon,
};
