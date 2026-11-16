import Photo from "./Photo";
import Reveal from "./Reveal";
import { OCCASIONS, lookLabel } from "@/lib/occasions";
import { publicFileExists } from "@/lib/public-files";

const MAX_PICKS = 9;

/** Preset looks whose photo has been rendered into public/lookbook (npm run render). */
function renderedPicks() {
  return OCCASIONS.flatMap((o) => o.looks.map((look, i) => ({ look, i, occasion: o.name })))
    .filter(({ look }) => look.demoImage && publicFileExists(look.demoImage))
    .slice(0, MAX_PICKS);
}

export default function LookbookStrip() {
  const picks = renderedPicks();
  if (picks.length < 3) return null;

  return (
    <section id="lookbook" className="scroll-mt-10 py-24 sm:py-32">
      <Reveal className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
        <div>
          <p className="label">Lookbook · Rendered with Soul ID</p>
          <h2 className="display mt-4 text-[clamp(38px,5.2vw,68px)]">
            One face, <span className="serif text-accent">every</span> occasion.
          </h2>
        </div>
        <p className="max-w-[36ch] text-[15px] leading-relaxed text-muted">
          Every photo here is the same person, styled by Kiim and rendered by Higgsfield Soul V2.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-8 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))]">
          {picks.map(({ look, i, occasion }) => (
            <li key={look.id} className="w-[64vw] max-w-[280px] shrink-0 snap-start sm:w-[260px]" data-cursor="hover">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-line bg-surface">
                <Photo src={look.demoImage} alt={`${look.title} — ${occasion}`} sizes="280px" className="object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="label !text-[10px]">
                    {occasion} · {lookLabel(i, look.mood).split(" · ")[1]}
                  </span>
                  <span className="serif mt-1 block text-[24px] leading-none">{look.title}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
