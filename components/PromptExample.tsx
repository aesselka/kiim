import Photo from "./Photo";
import Reveal from "./Reveal";
import { lookLabel } from "@/lib/occasions";
import { EXAMPLE_RUN } from "@/lib/site";

export default function PromptExample() {
  return (
    <section id="example" className="scroll-mt-10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label">From the studio · Rendered with Soul ID</p>
            <h2 className="display mt-4 text-[clamp(38px,5.2vw,68px)]">
              One wish, <span className="serif text-accent">many</span> moods.
            </h2>
          </div>
          <div className="glass max-w-[420px] rounded-[20px] px-5 py-4">
            <p className="label">She wrote</p>
            <p className="serif mt-2 text-[24px] leading-tight">“{EXAMPLE_RUN.wish}”</p>
          </div>
        </Reveal>

        <div className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:max-w-[880px] sm:grid-cols-2 sm:overflow-visible sm:px-0">
          {EXAMPLE_RUN.looks.map((look, i) => (
            <Reveal key={look.src} delay={0.08 * i} className="w-[72vw] shrink-0 snap-start sm:w-auto">
              <figure className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-line bg-surface" data-cursor="hover">
                <Photo src={look.src} alt={`${look.title} — ${look.mood} look`} sizes="(min-width: 640px) 440px, 72vw" className="object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <span className="label !text-[10px]">{lookLabel(look.index, look.mood)}</span>
                  <span className="serif mt-1 block text-[28px] leading-none">{look.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
