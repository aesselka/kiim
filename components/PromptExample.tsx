import Photo from "./Photo";
import Reveal from "./Reveal";
import { EXAMPLE_LOOKS } from "@/lib/site";

export default function PromptExample() {
  return (
    <section id="example" className="scroll-mt-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label">From the studio · Rendered with Soul ID</p>
            <h2 className="display mt-4 text-[clamp(38px,5.2vw,68px)]">
              One face, <span className="serif text-accent">many</span> moods.
            </h2>
          </div>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-muted">
            Typed into <span className="text-text">Your own</span> in the studio, rendered by Higgsfield Soul V2 on the
            same Soul ID.
          </p>
        </Reveal>

        <div className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {EXAMPLE_LOOKS.map((look, i) => (
            <Reveal key={look.src} delay={0.08 * i} className="w-[72vw] shrink-0 snap-start sm:w-auto">
              <figure className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-line bg-surface" data-cursor="hover">
                <Photo src={look.src} alt={`${look.title} — rendered with Soul ID`} sizes="(min-width: 640px) 30vw, 72vw" className="object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <span className="label !text-[10px]">{look.label}</span>
                  <span className="serif mt-1 block text-[28px] leading-none">{look.title}</span>
                  <span className="mt-2 block text-[13px] leading-snug text-text/65">“{look.wish}”</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
